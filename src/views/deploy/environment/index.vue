<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增部署环境</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑部署环境信息',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此部署环境',
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
    <EnvironmentModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="EnvironmentManagement">
  import { reactive } from 'vue';
  import { columns, searchFormSchema } from './environment.data';
  import { deleteEnvironment, getEnvironmentPageList } from '/@/api/deploy/environment';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import EnvironmentModal from './EnvironmentModal.vue';

  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const { createMessage } = useMessage();
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '部署环境列表',
    api: getEnvironmentPageList,
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
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    console.log(record);
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  function handleDelete(record: Recordable) {
    console.log(record.id);
    deleteEnvironment(record.id)
      .then(() => {
        createMessage.success('删除部署环境成功');
        reload();
      })
      .catch((err) => {
        createMessage.success('删除部署环境失败' + err.message);
      });
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      createMessage.success('更新部署环境成功');
      // 演示不刷新表格直接更新内部数据。
      // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
    } else {
      createMessage.success('新增部署环境成功');
      reload();
    }
  }
</script>
