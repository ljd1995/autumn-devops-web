<template>
  <BasicTable @register="registerTable" :searchInfo="searchInfo">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction
          :actions="[
            {
              icon: 'icon-park:warehousing',
              tooltip: '使用该记录',
              onClick: handleEdit.bind(null, record),
            },
          ]"
        />
      </template>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup name="AdhocHistory">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './adhoc.data';
  import { getAdhocHistoryPageList } from '/@/api/job/job';
  import { reactive } from 'vue';

  const emit = defineEmits(['use']);

  const searchInfo = reactive<Recordable>({});
  const [registerTable, {}] = useTable({
    title: '执行历史',
    api: getAdhocHistoryPageList,
    rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    canResize: false,
    handleSearchInfoFn(info) {
      console.log('handleSearchInfoFn', info);
      return info;
    },
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const handleEdit = (record) => {
    console.log(record);
    emit('use', record);
  };
</script>
