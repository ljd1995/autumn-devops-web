<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="脚本变更内容对比" width="80%">
    <p class="font-medium -mb-4">脚本名称: {{ nodeName }}</p>
    <Divider />
    <CodeDiff :old-string="oldContent" :new-string="newContent" output-format="side-by-side" />
  </BasicDrawer>
</template>
<script lang="ts" setup name="ScriptDiffDrawer">
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Divider } from 'ant-design-vue';
  import { CodeDiff } from 'v-code-diff';

  const nodeName = ref('');
  const oldContent = ref('');
  const newContent = ref('');

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    console.log('kk', data);
    nodeName.value = data.nodeName;
    oldContent.value = data.oldContent;
    newContent.value = data.newContent;
    setDrawerProps({ confirmLoading: false });
  });
</script>
