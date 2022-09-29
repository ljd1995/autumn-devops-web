<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="success" @click="handleTool">数据库工具</a-button>
        <a-button type="primary" @click="handleCreate">新增数据库</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑数据库信息',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此数据库',
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
    <DbModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { deleteDb, getDbPageList } from '/@/api/cmdb/db';
  import DbModal from './DbModal.vue';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';

  import { columns, searchFormSchema } from './db.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'DbManagement',
    components: { BasicTable, DbModal, TableAction, PageWrapper },
    setup() {
      const go = useGo();
      const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const { createMessage } = useMessage();
      const [registerTable, { reload, updateTableDataRecord }] = useTable({
        title: '数据库列表',
        api: getDbPageList,
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
        deleteDb(record.id)
          .then(() => {
            createMessage.success('删除数据库成功');
            reload();
          })
          .catch((err) => {
            createMessage.success('删除数据库失败' + err.message);
          });
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          createMessage.success('更新数据库成功');
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.id, values);
          console.log(result);
        } else {
          createMessage.success('新增数据库成功');
          reload();
        }
      }
      function handleTool() {
        go('/assets/db_operator');
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleTool,
        searchInfo,
      };
    },
  });
</script>
