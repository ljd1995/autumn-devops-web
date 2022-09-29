<template>
  <Table
    class="ml-2 mr-2 -mt-4"
    :columns="queryColumns"
    :data-source="queryData"
    size="small"
    :scroll="{ x: 800 }"
    bordered
    v-loading="loadingRef"
  />
</template>
<script lang="ts" setup name="DbQueryInfo">
  import { Table } from 'ant-design-vue';
  import { ref } from 'vue';
  import { executeSql } from '/@/api/cmdb/db';

  const queryColumns = ref<any>([]);
  const queryData = ref([]);
  const loadingRef = ref(false);

  const handleSqlQuery = (item, schemaName, sql) => {
    loadingRef.value = true;
    executeSql({
      username: item.admin_user,
      password: item.admin_password,
      host: item.address,
      port: item.port,
      db_type: item.db_type,
      schema_name: schemaName,
      sql: sql,
    })
      .then((data) => {
        data.map((i) => {
          queryColumns.value = Object.keys(i).map((key) => {
            return {
              title: key,
              dataIndex: key,
              key: key,
              align: 'center',
            };
          });
        });
        queryData.value = data as [];
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  defineExpose({ handleSqlQuery });
</script>
