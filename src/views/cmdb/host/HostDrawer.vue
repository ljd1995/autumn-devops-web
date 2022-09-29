<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="主机详情" width="630px">
    <Description @register="basicInfoRegister" class="enter-y" />
    <Description @register="deviceAndSystemInfoRegister" class="my-4 enter-y" />
    <Description @register="cpuAndMemoryInfoRegister" class="my-4 enter-y" />
    <div>
      <p class="font-bold ml-4 -mb-4">磁盘信息</p>
      <Divider />
      <Table
        class="ml-2 mr-2 -mt-4"
        :columns="diskColumns"
        :data-source="diskData"
        :pagination="false"
        bordered
      />
    </div>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Description, useDescription } from '/@/components/Description/index';
  import {
    basicInfoSchema,
    deviceAndSystemInfoSchema,
    cpuAndMemoryInfoSchema,
    diskColumns,
  } from './host.data';
  import { Divider, Table } from 'ant-design-vue';

  export default defineComponent({
    name: 'HostDrawer',
    components: { BasicDrawer, Description, Divider, Table },
    emits: ['success', 'register'],
    setup() {
      const [basicInfoRegister, basicMethods] = useDescription();
      const [deviceAndSystemInfoRegister, deviceMethods] = useDescription();
      const [cpuAndMemoryInfoRegister, cpuMethods] = useDescription();

      let diskData = ref([]);

      const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
        basicMethods.setDescProps({
          title: '基本信息',
          data: data.record,
          schema: basicInfoSchema,
          column: 2,
        });
        deviceMethods.setDescProps({
          title: '设备和系统信息',
          data: data.record,
          schema: deviceAndSystemInfoSchema,
          column: 2,
        });
        cpuMethods.setDescProps({
          title: 'CPU和内存信息',
          data: data.record,
          schema: cpuAndMemoryInfoSchema,
          column: 2,
        });
        diskData.value = data.record.disks;
        setDrawerProps({ confirmLoading: false });
      });

      return {
        registerDrawer,
        basicInfoRegister,
        deviceAndSystemInfoRegister,
        cpuAndMemoryInfoRegister,
        diskColumns,
        diskData,
      };
    },
  });
</script>
