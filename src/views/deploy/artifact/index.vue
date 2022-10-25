<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增制品</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑制品信息',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此制品',
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
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';

  import { columns, searchFormSchema } from './artifact.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deleteArtifact, getArtifactPageList } from '../../../api/deploy/cicd';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'ArtifactManagement',
    components: { BasicTable, TableAction, PageWrapper },
    setup() {
      const go = useGo();
      const router = useRouter();
      const searchInfo = reactive<Recordable>({});
      const { createMessage } = useMessage();
      const [registerTable, { reload }] = useTable({
        title: '制品列表',
        api: getArtifactPageList,
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
          path: '/deploy/artifact-info',
        });
      }

      function handleEdit(record: Recordable) {
        router.replace({
          path: '/deploy/artifact-info',
          query: {
            id: record.id,
          },
        });
      }

      function handleDelete(record: Recordable) {
        console.log(record.id);
        deleteArtifact(record.id)
          .then(() => {
            createMessage.success('删除制品成功');
            reload();
          })
          .catch((err) => {
            createMessage.success('删除制品失败' + err.message);
          });
      }

      function handleTool() {
        go('/assets/db_operator');
      }

      return {
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
        handleTool,
        searchInfo,
      };
    },
  });
</script>
