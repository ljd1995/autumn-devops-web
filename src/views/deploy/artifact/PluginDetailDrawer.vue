<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="编辑插件参数"
    width="86%"
    showFooter
    @ok="handleOk"
  >
    <Steps v-model:current="currentStep" size="small" @change="handleStepChange">
      <Step v-for="(item, index) in plugins" :key="index">
        <template #title>{{ item.name }}</template>
      </Step>
    </Steps>
    <Divider v-show="plugins.length > 0" />
    <div v-show="plugins.length > 0" class="plugin-form">
      <GitPlugin
        @submit="handlePluginSubmit"
        v-show="currentPluginName === 'Git操作'"
        :formData="formData"
      />
      <HelmPlugin
        @submit="handlePluginSubmit"
        v-show="currentPluginName === 'helm安装'"
        :formData="formData"
      />
      <DockerPlugin
        @submit="handlePluginSubmit"
        v-show="currentPluginName === 'docker操作'"
        :formData="formData"
      />
      <ShellPlugin
        @submit="handlePluginSubmit"
        v-show="currentPluginName === 'shell命令行执行'"
        :formData="formData"
      />
      <BuildPlugin
        @submit="handlePluginSubmit"
        v-show="currentPluginName === '代码编译'"
        :formData="formData"
      />
      <SqlPlugin
        @submit="handlePluginSubmit"
        v-show="currentPluginName === 'sql执行'"
        :formData="formData"
      />
      <ConfigPlugin
        @submit="handlePluginSubmit"
        v-show="currentPluginName === '配置修改'"
        :formData="formData"
      />
      <WebhookPlugin
        @submit="handlePluginSubmit"
        v-show="currentPluginName === 'Webhook推送'"
        :formData="formData"
      />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup name="PluginDetailDrawer">
  import { ref, unref } from 'vue';
  import { Steps, Step, Divider, Input } from 'ant-design-vue';
  import { CICDPluginListItem } from '/@/api/deploy/model/cicdModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import GitPlugin from './GitPlugin.vue';
  import HelmPlugin from './HelmPlugin.vue';
  import DockerPlugin from './DockerPlugin.vue';
  import ShellPlugin from './ShellPlugin.vue';
  import BuildPlugin from './BuildPlugin.vue';
  import SqlPlugin from './SqlPlugin.vue';
  import ConfigPlugin from './ConfigPlugin.vue';
  import WebhookPlugin from './WebhookPlugin.vue';

  const emit = defineEmits(['submit', 'register']);

  const currentPluginName = ref('');
  const rowIndex = ref(0);
  const formData = ref();

  const currentStep = ref<number>(0);
  const plugins = ref<CICDPluginListItem[]>([]);

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    rowIndex.value = data?.index;
    plugins.value = data?.record.plugins;
    const pluginItem = plugins.value[0];
    currentPluginName.value = pluginItem.name;
    formData.value = pluginItem.default_parameters;
  });

  const handleStepChange = (current) => {
    const pluginItem = plugins.value[current];
    currentPluginName.value = pluginItem.name;
    formData.value = pluginItem.default_parameters;
  };

  const handlePluginSubmit = ({ values }) => {
    plugins.value[currentStep.value].default_parameters = values;
    console.log(plugins.value[currentStep.value]);
  };

  const handleOk = async () => {
    closeDrawer();
    emit('submit', { plugins: unref(plugins), rowIndex: unref(rowIndex) });
  };
</script>
<style lang="less">
  .plugin-form {
    width: 700px;
    margin: 0 auto;
  }
</style>
