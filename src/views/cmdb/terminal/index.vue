<template>
  <PageWrapper dense contentFullHeight contentClass="flex" class="content">
    <HostTree class="w-3/8 xl:w-1/5 sm:w-1/3" @select="handleSelect" />
    <div class="w-5/8 xl:w-4/5 sm:w-2/3">
      <div class="help" v-show="panes.length === 0">
        <ul
          ><li>使用帮助</li>
          <li>1.左侧单击以连接主机</li>
          <li>2.支持跳板机代理登录</li>
          <li>3.终端中鼠标选中复制</li>
          <li>4.终端中鼠标右键粘贴</li>
          <li>5.选项卡鼠标右键快捷操作</li>
          <li>6.支持快速命令执行</li>
          <li>7.支持页面操作文件上传下载</li>
          <li>8.遗憾的是暂不支持rz/sz</li>
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
          <div>
            <TerminalOperator
              :terminal-key="pane.key"
              ref="terminalOperatorRef"
              @init-success="handleTerminalInitSuccess(pane.key, $event)"
            />
          </div>
        </TabPane>
      </Tabs>
      <TerminalExtra v-show="panes.length > 0" :socket-list="socketList" :active-key="activeKey" />
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup name="Terminal">
  import { PageWrapper } from '/@/components/Page';
  import HostTree from './HostTree.vue';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { nextTick, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import TerminalOperator from './TerminalOperator.vue';
  import { getToken } from '/@/utils/auth';
  import TerminalExtra from './TerminalExtra.vue';

  const activeKey = ref('');
  const newTabIndex = ref(0);
  const panes = ref<{ title: string; key: string }[]>([]);

  const hostList = ref({});
  const termList = reactive({});
  const socketList = reactive({});
  const terminalOperatorRef = ref<InstanceType<typeof TerminalOperator>>();

  const { createMessage } = useMessage();

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
  };

  const onEdit = (targetKey: string | MouseEvent) => {
    remove(targetKey as string);
  };

  const handleTabChange = (key: string) => {
    console.log(key);
    termList[key]?.focus();
  };

  const handleTerminalInitSuccess = (key, item) => {
    console.log(key, item);
    socketList[key] = item.socket;
    termList[key] = item.term;
    console.log(socketList, termList);
  };

  const initSocket = (hostId) => {
    nextTick(() => {
      console.log(terminalOperatorRef);
      const socketURI = `ws://127.0.0.1:8000/api/v1/ws?host_id=${hostId}&token=${getToken()}`;
      const paneLength = panes.value.length;
      terminalOperatorRef.value![paneLength - 1].initWebSocket(socketURI);
    });
  };

  const handleReconnect = (key) => {
    const hostId = hostList[key];
    createMessage.info(`正在重新连接${hostId},请等待......`);
    initSocket(hostId);
  };

  const handleSelect = (value) => {
    console.log(value);
    try {
      if (value && String(value).startsWith('host')) {
        const values = value.split('-');
        createMessage.info(`正在连接${values[1]},请等待......`);
        add(values[1]);
        hostList[activeKey.value] = values[2];
        initSocket(values[2]);
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
            initSocket(hostId);
          },
        },
        {
          label: '重新连接',
          handler: () => {
            nextTick(() => {
              remove(pane.key);
              add(pane.title);
              hostList[activeKey.value] = pane.key;
              handleReconnect(pane.key);
            });
          },
        },
        {
          label: '关闭当前选项卡',
          handler: () => {
            remove(pane.key);
            socketList[pane.key].close();
          },
        },
        {
          label: '关闭其他选项卡',
          handler: () => {
            for (const key in panes.value) {
              if (pane.key != key) {
                remove(key);
                socketList[key].close();
              }
            }
          },
        },
      ],
    });
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
