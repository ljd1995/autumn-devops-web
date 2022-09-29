<template>
  <PageWrapper>
    <p class="font-bold ml-4 mt-4 -mb-4">表信息</p>
    <Divider />
    <Table
      class="ml-2 mr-2 -mt-4"
      :columns="tableColumns"
      :data-source="tableData"
      :pagination="false"
      size="small"
      bordered
    />
  </PageWrapper>
</template>
<script lang="ts" setup name="DbTable">
  import { Table, Divider } from 'ant-design-vue';
  import { toRefs } from 'vue';
  import { tableColumns } from './db.data';
  import { PageWrapper } from '/@/components/Page';

  const props = defineProps({
    tableData: {
      type: Array,
      required: true,
    },
  });

  const { tableData } = toRefs(props);
</script>
<style lang=""></style>
