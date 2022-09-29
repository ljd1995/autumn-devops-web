<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <HostTree class="w-1/5 xl:w-1/6" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-4/5 xl:w-5/6" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="danger" @click="handleTerminal">终端</a-button>
        <a-button type="primary" @click="handleCreate">新增主机</a-button>
        <a-button type="success" @click="handleSelectRow">关联主机组</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line',
                tooltip: '查看主机详情',
                onClick: handleDetail.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑主机',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此主机',
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
    <HostModal @register="registerModal" @success="handleSuccess" />
    <AssociateModal @register="registerAssociateModal" @success="handleSuccess" />
    <HostDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { deleteHost, getHostPageList } from '/@/api/cmdb/host';
  import { PageWrapper } from '/@/components/Page';
  import HostTree from './HostTree.vue';
  import HostDrawer from './HostDrawer.vue';

  import { useModal } from '/@/components/Modal';
  import HostModal from './HostModal.vue';
  import AssociateModal from './associateModal.vue';

  import { columns, searchFormSchema } from './host.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'HostManagement',
    components: {
      BasicTable,
      PageWrapper,
      HostTree,
      HostModal,
      AssociateModal,
      HostDrawer,
      TableAction,
    },
    setup() {
      const router = useRouter();
      const [registerModal, { openModal }] = useModal();
      const [registerAssociateModal, AssociateModalMethods] = useModal();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const searchInfo = reactive<Recordable>({});
      const { createMessage } = useMessage();
      const [registerTable, { reload, updateTableDataRecord, getSelectRowKeys }] = useTable({
        title: '主机列表',
        api: getHostPageList,
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
        striped: true,
        canResize: true,
        rowSelection: {
          type: 'checkbox',
        },
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
        deleteHost(record.id)
          .then(() => {
            createMessage.success('删除主机成功');
            reload();
          })
          .catch((err) => {
            createMessage.success('删除主机失败' + err.message);
          });
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          createMessage.success('更新主机成功');
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.id, values);
          console.log(result);
        } else {
          createMessage.success('新增主机成功');
          reload();
        }
      }

      function handleSelect(hostGroupId) {
        searchInfo.host_group_id = hostGroupId;
        reload();
      }

      function handleDetail(record: Recordable) {
        console.log(record);
        openDrawer(true, { record });
      }

      function handleSelectRow() {
        const keys = getSelectRowKeys();
        if (keys.length === 0) {
          createMessage.warning('未选择一条主机记录，请选择！');
          return;
        }
        AssociateModalMethods.openModal(true, { keys });
      }

      const handleTerminal = () => {
        console.log(router);
        const { href } = router.resolve({ path: '/terminal' });
        // go('/assets/terminal');
        window.open(href, '_blank');
      };

      return {
        registerTable,
        registerModal,
        registerAssociateModal,
        registerDrawer,
        handleCreate,
        handleDetail,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
        handleSelectRow,
        handleTerminal,
        searchInfo,
      };
    },
  });
</script>
