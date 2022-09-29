<template>
  <PageWrapper>
    <p class="font-bold ml-4 mt-4 -mb-4">字段</p>
    <Divider />
    <Table
      class="ml-2 mr-2 -mt-4"
      :columns="dbColumns"
      :data-source="columnData"
      :pagination="false"
      size="small"
      bordered
    />
  </PageWrapper>
</template>
<script lang="ts" setup name="DbColumn">
  import { Table, Divider } from 'ant-design-vue';
  import { toRefs } from 'vue';
  import { dbColumns } from './db.data';
  import { PageWrapper } from '/@/components/Page';

  const props = defineProps({
    columnData: {
      type: Array,
      required: true,
    },
  });

  const { columnData } = toRefs(props);
</script>
<style lang=""></style>
