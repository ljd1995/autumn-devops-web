<template>
  <PageWrapper dense contentFullHeight contentClass="flex" class="content">
    <HostTree class="w-3/8 xl:w-1/5 sm:w-1/3" @select="handleSelect" />
    <div class="w-5/8 xl:w-4/5 sm:w-2/3">
      <div class="help" v-show="panes.length === 0">
        <ul
          ><li>使用帮助</li>
          <li>1.左侧单击以连接主机</li>
          <li>2.终端中鼠标选中复制</li>
          <li>3.终端中鼠标右键粘贴</li>
          <li>4.选项卡鼠标右键快捷操作</li>
          <li>5.目前暂不支持lrzsz来进行文件上传下载</li>
          <li>简单点，就是类似xshell操作</li></ul
        >
      </div>
      <Tabs
        :class="panes.length > 0 ? 'bg-gray-100' : 'tab'"
        v-model:activeKey="activeKey"
        type="editable-card"
        hide-add
        @edit="onEdit"
        size="small"
        @change="handleTabChange"
      >
        <TabPane v-for="pane in panes" :key="pane.key">
          <template #tab>
            <span @contextmenu="handleTabContext(pane, $event)">
              {{ pane.title }}
            </span>
          </template>
          <div v-show="!resultShow">
            <div :id="`terminal-${pane.key}`" :key="pane.key" class="console"></div>
            <Input
              v-model:value="quickCommand"
              class="w-full"
              placeholder="支持快速命令操作，请输入命令，使用回车键发送"
              @keyup.enter="sendQuickCommand"
            >
              <template #addonBefore>
                <Icon icon="ep:promotion" />
              </template>
              <template #addonAfter>
                <Select v-model:value="commandSendType" style="width: 150px">
                  <SelectOption value="current">当前选项卡</SelectOption>
                  <SelectOption value="all">所有选项卡</SelectOption>
                </Select>
              </template>
            </Input>
          </div>
          <Result
            v-show="resultShow"
            status="error"
            title="SSH连接失败"
            subTitle="终端默认会重连1次"
            style="height: calc(100vh - 55px)"
          >
            <template #extra>
              <a-button key="reconnect" type="primary" @click="handleReconnect(activeKey)"
                >重新连接</a-button
              >
              <a-button key="close" @click="() => remove(activeKey)">关闭连接</a-button>
            </template>

            <div class="desc">
              <p style="font-size: 16px">
                <strong>原因可能如下：</strong>
              </p>
              <ul>
                <li>1. 主机用户名密码不正确.</li>
                <li>2. socket连接失败.</li>
                <li>3. socket超时退出.</li>
                <li>4. 其他异常情况</li>
              </ul>
            </div>
          </Result>
        </TabPane>
      </Tabs>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup name="Terminal">
  import { PageWrapper } from '/@/components/Page';
  import HostTree from './HostTree.vue';
  import { Tabs, TabPane, Result, Select, SelectOption, Input } from 'ant-design-vue';
  import { reactive, ref, unref, watchEffect } from 'vue';
  import 'xterm/css/xterm.css';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useWebSocket, useClipboard } from '@vueuse/core';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import Icon from '/@/components/Icon';
  import { AttachAddon } from './xterm-addon-attach';

  const activeKey = ref('');
  const newTabIndex = ref(0);
  const panes = ref<{ title: string; key: string }[]>([]);
  const resultShow = ref(false);
  const hostList = ref({});
  const selection = ref('');
  const state = reactive({
    server: '',
  });
  const quickCommand = ref('');
  const commandSendType = ref('all');

  const { createMessage } = useMessage();
  const { text, isSupported, copy } = useClipboard();

  const [createContextMenu] = useContextMenu();

  const add = (title) => {
    activeKey.value = `${newTabIndex.value++}`;
    panes.value.push({
      title: title,
      key: activeKey.value,
    });
  };

  const remove = (targetKey: string) => {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    panes.value = panes.value.filter((pane) => pane.key !== targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
      if (lastIndex >= 0) {
        activeKey.value = panes.value[lastIndex].key;
      } else {
        activeKey.value = panes.value[0].key;
      }
    }
    currentTerm.value = termList[activeKey.value];
    currentSocket.value = socketList[activeKey.value];
    resultShow.value = false;
  };

  const onEdit = (targetKey: string | MouseEvent) => {
    remove(targetKey as string);
  };

  const handleTabChange = (key: string) => {
    console.log(key);
    currentTerm.value = termList[key];
    currentSocket.value = socketList[key];
    termList[key]?.focus();
    if (currentTerm.value) {
      resultShow.value = false;
    } else {
      resultShow.value = true;
    }
  };

  const handleReconnect = (key) => {
    resultShow.value = false;
    const hostId = hostList[key];
    createMessage.info(`正在重新连接${hostId},请等待......`);
    state.server = `ws://127.0.0.1:8000/api/v1/ws?host_id=${hostId}`;
    initWebSocket();
  };

  // terminal
  const currentSocket = ref();
  const currentTerm = ref();
  const termList = reactive({});
  const socketList = reactive({});

  const height = Math.floor(window.screen.availHeight / 20);

  const initTerm = (socket) => {
    try {
      const term = new Terminal({
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
      term.open(document.getElementById(`terminal-${activeKey.value}`) as unknown as HTMLElement);
      // 关键代码，让tab切换时有currentTerm概念，解决socketOnmessage，socketOnClose两个事件只在最后一个tab生效的问题
      // 问题描述：当添加了>1个tab(有2个或2个以上terminal),由于每次添加tab后，term值被修改为最后新增的tab时的term值，
      // 当切换tab时，term值不会改变,导致在其他tab下的terminal输入命令时，命令值总是展示在最后一个tab上的terminal上
      // 解决办法：tab切换时，currentTerm同时改变，前提是socketOnmessage，socketOnClose两个事件要绑定的是currentTerm，而不是term
      currentTerm.value = term;
      termList[activeKey.value] = term;
      // 自适应大小组件
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new AttachAddon(socket));
      term.focus();
      console.log(`terminal-${activeKey.value}`);
      // 输出欢迎语
      term.writeln(
        '\n \x1B[1;3;36mWelcome to autumn devops web terminal,please enjoy it and have a good time! \x1B[0m',
      );
      // 换行并输入起始符“$”
      term.write('\r\n$ ');
      // 自适应大小
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
      term.onResize((size) => {
        fitAddon.fit();
        socket.send(
          JSON.stringify({
            data: { cols: size?.cols, rows: size?.rows },
            type: 'resize',
          }),
        );
      });
      fitAddon.fit();
      // //监视命令行输入
      // term.onData((data) => {
      //   socket.send(
      //     JSON.stringify({
      //       data: data,
      //       type: 'content',
      //     }),
      //   );
      // });
      //监听终端字符选择
      term.onSelectionChange(() => {
        selection.value = term.getSelection();
        const value = unref(selection);
        if (!value) {
          return;
        }
        if (isSupported) {
          copy(selection.value);
          createMessage.success('Copied');
          term.focus();
        } else {
          createMessage.warning('Your browser does not support Clipboard API');
        }
      });

      document.getElementById(`terminal-${activeKey.value}`)!.oncontextmenu = (e) => {
        e.preventDefault();
        currentSocket.value.send(text.value);
      };

      return term;
    } catch (e) {
      console.log(e);
      console.log('init term failed');
      return null;
    }
  };

  // vueuse websocket
  const socketOnConnected = (ws: WebSocket) => {
    resultShow.value = false;
    console.log('web链接成功');
    currentSocket.value = ws;
    socketList[activeKey.value] = ws;
    // 链接成功后
    initTerm(ws);
  };

  const socketOnDisconnected = (ws: WebSocket, event: CloseEvent) => {
    resultShow.value = true;
    console.log(ws, '关闭 socket', event);
    // createMessage.error(`socket连接失败`);
    currentTerm.value = null;
    // TODO: remove close term and socket in termList, socketList
  };

  const socketOnError = (ws: WebSocket, event: Event) => {
    console.log(ws, 'socket 链接失败', event);
    resultShow.value = true;
    currentTerm.value = null;
  };

  const socketOnMessage = (ws: WebSocket, event: MessageEvent) => {
    for (const key in socketList) {
      if (socketList[key] === ws) {
        const term = termList[key];
        const msg = JSON.parse(event.data);
        if (msg.type == 'content') {
          term.write(msg.data);
        } else if (msg.type == 'heartbeat') {
          // console.log('websocket heartbeat success');
        }
      }
    }
  };

  const initWebSocket = () => {
    // const term = ref();
    useWebSocket(state.server, {
      autoReconnect: {
        retries: 1,
        delay: 5000,
        onFailed() {
          createMessage.error('Failed to connect WebSocket after 1 retries');
        },
      },
      heartbeat: false,
      // heartbeat: {
      //   message: JSON.stringify({
      //     data: 'ping',
      //     type: 'heartbeat',
      //   }),
      //   interval: 10000,
      // },
      onConnected: (ws: WebSocket) => {
        resultShow.value = false;
        console.log('web链接成功');
        currentSocket.value = ws;
        socketList[activeKey.value] = ws;
        // 链接成功后
        initTerm(ws);
      },
      // onDisconnected: socketOnDisconnected,
      // onError: socketOnError,
      // // onMessage: socketOnMessage,
      // onMessage: (ws: WebSocket, event: MessageEvent) => {
      //   const msg = JSON.parse(event.data);
      //   if (msg.type == 'content') {
      //     term.value.write(msg.data);
      //   } else if (msg.type == 'heartbeat') {
      //     // console.log('websocket heartbeat success');
      //   }
      // },
    });
  };

  const handleSelect = (value) => {
    console.log(value);
    resultShow.value = false;
    try {
      if (value && String(value).startsWith('host')) {
        const values = value.split('-');
        createMessage.info(`正在连接${values[1]},请等待......`);
        add(values[1]);
        hostList[activeKey.value] = values[2];
        state.server = `ws://127.0.0.1:8000/api/v1/ws?host_id=${values[2]}`;
        initWebSocket();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleTabContext = (pane, e: MouseEvent) => {
    console.log(e);
    createContextMenu({
      event: e,
      items: [
        {
          label: '复制会话',
          handler: () => {
            add(pane.title);
            const hostId = hostList[pane.key];
            hostList[activeKey.value] = hostId;
            state.server = `ws://127.0.0.1:8000/api/v1/ws?host_id=${hostId}`;
            initWebSocket();
          },
        },
        {
          label: '重新连接',
          handler: () => {
            termList[pane.key].dispose();
            socketList[pane.key].close();
            handleReconnect(pane.key);
          },
        },
        {
          label: '关闭当前选项卡',
          handler: () => {
            remove(pane.key);
          },
        },
        {
          label: '关闭其他选项卡',
          handler: () => {
            for (const key in panes.value) {
              if (pane.key != key) {
                remove(key);
              }
            }
          },
        },
      ],
    });
  };

  const sendQuickCommand = () => {
    if (!quickCommand.value) {
      createMessage.warning('当前命令为空，已取消发送，请检查！');
      return;
    }
    if (commandSendType.value == 'all') {
      for (let key in termList) {
        console.log(key);
        socketList[key].send(quickCommand.value + '\n');
      }
      console.log(termList['0'] === termList['1']);
    } else {
      socketList[activeKey.value].send(quickCommand.value + '\n');
    }
  };
</script>
<style lang="less" scoped>
  .content {
    height: 100vh;
    background-color: #2b2b2b;
  }

  .tab {
    background-color: #2b2b2b;
  }

  .console {
    width: 100%;
    height: calc(100vh - 69px);
    max-height: calc(100vh - 69px);
    background-color: #2b2b2b;
    margin-top: -15px;
  }

  .help {
    color: rgb(106, 93, 93);
    font-size: 17px;
    height: calc(100vh - 55px);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
  }
</style>
