<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增配置中心</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑配置中心信息',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此配置中心',
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
    <ConfigCenterModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import ConfigCenterModal from './configCenterModal.vue';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';

  import { columns, searchFormSchema } from './configCenter.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deleteConfigCenter, getConfigCenterPageList } from '/@/api/cmdb/configCenter';

  export default defineComponent({
    name: 'ConfigCenterManagement',
    components: { BasicTable, ConfigCenterModal, TableAction, PageWrapper },
    setup() {
      const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const { createMessage } = useMessage();
      const [registerTable, { reload, updateTableDataRecord }] = useTable({
        title: '数据库列表',
        api: getConfigCenterPageList,
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
        deleteConfigCenter(record.id)
          .then(() => {
            createMessage.success('删除配置中心成功');
            reload();
          })
          .catch((err) => {
            createMessage.success('删除配置中心失败' + err.message);
          });
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          createMessage.success('更新配置中心成功');
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.id, values);
          console.log(result);
        } else {
          createMessage.success('新增配置中心成功');
          reload();
        }
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        searchInfo,
      };
    },
  });
</script>
