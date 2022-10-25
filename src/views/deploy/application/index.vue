<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增应用</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑应用信息',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此应用',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup name="EnvironmentManagement">
  import { reactive } from 'vue';
  import { columns, searchFormSchema } from './application.data';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deleteApplication, getApplicationPageList } from '/@/api/deploy/application';
  import { useRouter } from 'vue-router';

  const searchInfo = reactive<Recordable>({});
  const router = useRouter();
  const { createMessage } = useMessage();
  const [registerTable, { reload }] = useTable({
    title: '应用列表',
    api: getApplicationPageList,
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
    handleSearchInfoFn(info) {
      console.log('handleSearchInfoFn', info);
      return info;
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });

  function handleCreate() {
    router.replace({
      path: '/deploy/application-info',
    });
  }

  function handleEdit(record: Recordable) {
    router.replace({
      path: '/deploy/application-info',
      query: {
        id: record.id,
      },
    });
  }

  function handleDelete(record: Recordable) {
    console.log(record.id);
    deleteApplication(record.id)
      .then(() => {
        createMessage.success('删除应用成功');
        reload();
      })
      .catch((err) => {
        createMessage.success('删除应用失败' + err.message);
      });
  }
</script>
