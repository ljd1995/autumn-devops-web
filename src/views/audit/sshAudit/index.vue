<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';

  import { columns, searchFormSchema } from './ssh.data';
  import { getSshPageList } from '/@/api/audit/operator';

  export default defineComponent({
    name: 'SSHAudit',
    components: { BasicTable, PageWrapper },
    setup() {
      const searchInfo = reactive<Recordable>({});
      const [registerTable, {}] = useTable({
        title: 'SSH日志列表',
        api: getSshPageList,
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
      });

      return {
        registerTable,
        searchInfo,
      };
    },
  });
</script>
