<template>
  <div :id="`terminal-${terminalKey}`" :key="terminalKey" class="console"></div>
</template>
<script lang="ts" setup name="TerminalOperator">
  import 'xterm/css/xterm.css';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useWebSocket, useClipboard } from '@vueuse/core';
  import { ref, toRefs, onBeforeUnmount } from 'vue';

  const emit = defineEmits(['init-success']);

  const props = defineProps({
    terminalKey: {
      type: String,
      required: true,
    },
  });

  const { terminalKey } = toRefs(props);

  const { createMessage } = useMessage();
  const { text, isSupported, copy } = useClipboard();

  const term = ref<Terminal | undefined>();
  const filename = ref('test.txt');
  const socket = ref();

  const height = Math.floor(window.screen.availHeight / 20);

  const initTerminal = (socket) => {
    try {
      term.value = new Terminal({
        fastScrollModifier: 'ctrl',
        allowProposedApi: true,
        rightClickSelectsWord: false,
        rows: height, // 行数
        // cols: 188,
        convertEol: true, // 启用时，光标将设置为下一行的开头
        scrollback: 8000, // 终端中的回滚量
        fontSize: 15, // 字体大小
        disableStdin: false, // 是否应禁用输入。
        cursorStyle: 'block', // 光标样式
        cursorBlink: true, // 光标闪烁
        tabStopWidth: 4,
        fontFamily: 'Menlo For Powerline,Consolas,Liberation Mono,Menlo,Courier,monospace',
        theme: {
          foreground: '#d2d2d2', // 字体
          background: '#2b2b2b', // 背景色
          cursor: '#adadad',
          black: '#000000',
          red: '#d81e00',
          green: '#5ea702',
          yellow: '#cfae00',
          blue: '#427ab3',
          magenta: '#89658e',
          cyan: '#00a7aa',
          white: '#dbded8',
          brightBlack: '#686a66',
          brightRed: '#f54235',
          brightGreen: '#99e343',
          brightYellow: '#fdeb61',
          brightBlue: '#84b0d8',
          brightMagenta: '#bc94b7',
          brightCyan: '#37e6e8',
          brightWhite: '#f1f1f0',
        },
      });
      // 获取terminal dom
      const terminalElement = document.getElementById(
        `terminal-${terminalKey.value}`,
      ) as unknown as HTMLElement;
      console.log(`terminal-${terminalKey.value}`);
      term.value.open(terminalElement);
      // 自适应大小组件
      const fitAddon = new FitAddon();
      term.value.loadAddon(fitAddon);
      term.value.focus();
      // 输出欢迎语
      term.value.writeln(
        '\n \x1B[1;3;36mWelcome to autumn devops web terminal,please enjoy it and have a good time! \x1B[0m',
      );
      // 换行并输入起始符“$”
      term.value.write('\r\n$ ');
      // 不能初始化的时候fit,需要等terminal准备就绪,可以设置延时操作
      setTimeout(() => {
        fitAddon.fit();
        // resize pty
        const dims = fitAddon.proposeDimensions();
        socket.send(
          JSON.stringify({
            data: { cols: dims?.cols, rows: dims?.rows },
            type: 'resize',
          }),
        );
      }, 5);

      // 监听term resize事件，然后自适应大小变化并发送变化后的长宽给后端去resize
      term.value.onResize((size) => {
        fitAddon.fit();
        socket.send(
          JSON.stringify({
            data: { cols: size?.cols, rows: size?.rows },
            type: 'resize',
          }),
        );
      });
      fitAddon.fit();
      // 设置socket binaryType
      socket.binaryType = 'arraybuffer';
      // 监视命令行输入
      term.value.onData((data) => {
        socket.send(
          JSON.stringify({
            data: data,
            type: 'content',
          }),
        );
      });
      //监听终端字符选择
      term.value.onSelectionChange(() => {
        const selection = term.value?.getSelection();
        if (!selection) {
          return;
        }
        if (isSupported) {
          copy(selection);
          createMessage.success('Copied');
          term.value?.focus();
        } else {
          createMessage.warning('Your browser does not support Clipboard API');
        }
      });
      // 监听鼠标右键，用于粘贴字符串到终端
      terminalElement!.oncontextmenu = (e) => {
        e.preventDefault();
        socket.send(text.value);
      };
      // 传递socket和ws给父组件
      emit('init-success', { socket, term: term.value });
    } catch (e) {
      console.log(e);
      console.log('init term failed');
    }
  };

  // vueuse websocket
  const socketOnConnected = (ws: WebSocket) => {
    console.log('web链接成功');
    // 链接成功后
    initTerminal(ws);
  };

  const socketOnDisconnected = (ws: WebSocket, event: CloseEvent) => {
    console.log(ws, '关闭 socket', event);
    term.value?.write('\n\n');
    term.value?.write('Connection closing...Socket close.');
    term.value?.write('\n\n');
    term.value?.write('Connection closed by foreign host.');
    term.value?.write('\n\n');
    term.value?.write(
      'Disconnected from remote host at ' +
        new Date().toLocaleDateString() +
        ' ' +
        new Date().toLocaleTimeString(),
    );
    term.value?.write('\n\n');
  };

  const socketOnError = (ws: WebSocket, event: Event) => {
    console.log(ws, 'socket 链接失败', event);
    createMessage.error('连接失败，主机信息错误或者权限拒绝！');
  };

  const socketOnMessage = (_ws: WebSocket, event: MessageEvent) => {
    try {
      const data: ArrayBuffer | string = event.data;
      if (typeof data === 'string') {
        const msg = JSON.parse(event.data);
        if (msg.type == 'content') {
          term.value?.write(msg.data);
        } else if (msg.type == 'error') {
          createMessage.error('socket连接过程中发生错误:' + msg.data);
        } else if (msg.type == 'file') {
          filename.value = msg.data;
        } else if (msg.type == 'success') {
          createMessage.success(msg.data);
        } else if (msg.type == 'heartbeat') {
          // console.log('websocket heartbeat success');
        }
      } else {
        const buffer = new Uint8Array(data);
        downloadByData(buffer, filename.value);
        createMessage.success('文件下载成功');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const initWebSocket = (socketURI: string) => {
    socket.value = useWebSocket(socketURI, {
      // autoReconnect: {
      //   retries: 1,
      //   delay: 5000,
      //   onFailed() {
      //     createMessage.error('Failed to connect WebSocket after 1 retries');
      //   },
      // },
      autoReconnect: false,
      heartbeat: {
        message: JSON.stringify({
          data: 'ping',
          type: 'heartbeat',
        }),
        interval: 10000,
      },
      onConnected: socketOnConnected,
      onDisconnected: socketOnDisconnected,
      onError: socketOnError,
      onMessage: socketOnMessage,
    });
  };

  const downloadByData = (data: BlobPart, filename: string, mime?: string, bom?: BlobPart) => {
    const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
    const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  };

  onBeforeUnmount(() => {
    try {
      console.log('onBeforeUnmount');
      console.log(socket);
      socket.value.close();
    } catch (e) {
      console.log(e);
    }
  });

  defineExpose({ initWebSocket });
</script>
<style lang="less" scoped>
  .console {
    width: 100%;
    height: calc(100vh - 69px);
    max-height: calc(100vh - 69px);
    background-color: #2b2b2b;
    margin-top: -15px;
  }
</style>
