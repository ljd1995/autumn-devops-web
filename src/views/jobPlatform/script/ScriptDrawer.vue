<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" width="580px">
    <p class="font-medium -mb-4">更新历史 / {{ nodeName }}</p>
    <Divider />
    <Timeline>
      <TimelineItem v-for="item in historyData" :key="item.id"
        ><p>修改于 {{ item.update_time }}</p>
        <Row>
          <Col :span="5"
            ><span class="text-blue-400">{{ item.update_user }}</span></Col
          ><Col :span="14"
            ><span class="text-green-400">{{ item.md5 }}</span></Col
          ><Col :span="3"
            ><a-button type="ghost" preIcon="bx:git-compare" @click="handleCompare(item)"
              >比较</a-button
            ></Col
          ></Row
        ></TimelineItem
      >
    </Timeline>
  </BasicDrawer>
</template>
<script lang="ts" setup name="ScriptDrawer">
  import { ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Divider, Timeline, TimelineItem, Col, Row } from 'ant-design-vue';
  import { ScriptHistoryModel } from '/@/api/job/model/jobModel';

  const historyData = ref<ScriptHistoryModel[]>([]);
  const nodeName = ref('');

  const emit = defineEmits(['compare', 'register']);

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    historyData.value = data.items;
    nodeName.value = data.nodeName;
    console.log(historyData);
    setDrawerProps({ confirmLoading: false });
  });

  const handleCompare = (item) => {
    emit('compare', {
      oldContent: item.old_content,
      newContent: item.new_content,
    });
  };
</script>
