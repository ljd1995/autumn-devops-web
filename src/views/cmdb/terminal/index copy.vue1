<template>
  <PageWrapper dense contentFullHeight contentClass="flex" class="content">
    <HostTree class="w-3/8 xl:w-1/5 sm:w-1/3" @select="handleSelect" />
    <div class="w-5/8 xl:w-4/5 sm:w-2/3">
      <Tabs
        :class="panes.length > 0 ? 'bg-gray-100' : 'tab'"
        v-model:activeKey="activeKey"
        type="editable-card"
        hide-add
        @edit="onEdit"
        size="small"
        @change="handleTabChange"
      >
        <TabPane v-for="pane in panes" :key="pane.key" :tab="pane.title" forceRender>
          <div :id="`terminal-${pane.key}`" class="console" v-show="!resultShow"></div>
          <Result
            v-show="resultShow"
            status="error"
            title="SSH连接失败"
            style="height: calc(100vh - 55px)"
          >
            <template #extra>
              <a-button key="reconnect" type="primary" @click="handleReconnect">重新连接</a-button>
              <a-button key="close" @click="() => remove(activeKey)">关闭连接</a-button>
            </template>

            <div class="desc">
              <p style="font-size: 16px">
                <strong>原因可能如下：</strong>
              </p>
              <p>1. 主机用户名密码不正确.</p>
              <p>2. socket连接失败.</p>
              <p>3. socket超时退出.</p>
              <p>4. 其他异常情况</p>
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
  import { Tabs, TabPane, Result } from 'ant-design-vue';
  import { reactive, ref, unref } from 'vue';
  import 'xterm/css/xterm.css';
  import { Terminal } from 'xterm';
  import { FitAddon } from 'xterm-addon-fit';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';

  const activeKey = ref('');
  const newTabIndex = ref(0);
  const panes = ref<{ title: string; key: string }[]>([]);
  const resultShow = ref(false);
  const hostList = ref({});
  const selection = ref('');

  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();

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
  };

  const onEdit = (targetKey: string | MouseEvent) => {
    remove(targetKey as string);
  };

  const handleTabChange = (activeKey: string) => {
    console.log(activeKey);
    currentTerm.value = termList[activeKey];
    currentSocket.value = socketList[activeKey];
    termList[activeKey]?.focus();
    if (currentTerm.value) {
      resultShow.value = false;
    } else {
      resultShow.value = true;
    }
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
        initSocket(`ws://127.0.0.1:8000/api/v1/ws?host_id=${values[2]}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleReconnect = () => {
    resultShow.value = false;
    const hostId = hostList[activeKey.value];
    createMessage.info(`正在重新连接${hostId},请等待......`);
    initSocket(`ws://127.0.0.1:8000/api/v1/ws?host_id=${hostId}`);
  };

  // terminal
  const currentSocket = ref();
  const currentTerm = ref();
  const termList = reactive({});
  const socketList = reactive({});

  const initSocket = (socketURI) => {
    const socket = new WebSocket(socketURI);
    socket.onclose = socketOnClose;
    socket.onopen = () => {
      console.log('web链接成功');
      currentSocket.value = socket;
      socketList[activeKey.value] = socket;
      // 链接成功后
      initTerm();
    };
    socket.onmessage = socketOnmessage;
    socket.onerror = socketOnError;
  };

  // const socketOnOpen = () => {
  //   console.log('web链接成功');
  //   currentSocket.value = socket;
  //   // 链接成功后
  //   initTerm();
  // };

  const socketOnmessage = (event) => {
    currentTerm.value.write(event.data);
  };

  const socketOnClose = (e) => {
    resultShow.value = true;
    console.log('关闭 socket' + e);
    createMessage.error(`socket连接失败`);
    currentTerm.value = null;
  };
  const socketOnError = (e) => {
    console.log('socket 链接失败' + e);
    resultShow.value = true;
    currentTerm.value = null;
  };

  const height = Math.floor(window.screen.availHeight / 20);

  const initTerm = () => {
    try {
      const term = new Terminal({
        fastScrollModifier: 'ctrl',
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
        currentSocket.value.send(
          JSON.stringify({
            data: { cols: dims?.cols, rows: dims?.rows },
            type: 'resize',
          }),
        );
      }, 5);

      // 监听term resize事件，然后自适应大小变化并发送变化后的长宽给后端去resize
      term.onResize((size) => {
        fitAddon.fit();
        currentSocket.value.send(
          JSON.stringify({
            data: { cols: size?.cols, rows: size?.rows },
            type: 'resize',
          }),
        );
      });
      fitAddon.fit();
      //监视命令行输入
      term.onData((data) => {
        currentSocket.value.send(
          JSON.stringify({
            data: data,
            type: 'content',
          }),
        );
      });
      //监听终端字符选择
      term.onSelectionChange(() => {
        selection.value = term.getSelection();
        const value = unref(selection);
        if (!value) {
          return;
        }
        clipboardRef.value = value;
        if (unref(copiedRef)) {
          createMessage.success('Copied');
          term.focus();
        }
      });
    } catch (e) {
      console.log('init term failed');
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
    height: calc(100vh - 55px);
    max-height: calc(100vh - 55px);
    background-color: #2b2b2b;
    margin-top: -15px;
  }
</style>
