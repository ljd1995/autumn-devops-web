<template>
  <p class="font-400 ml-4 -mb-4">{{ sql }}</p>
  <Divider />
  <DbQueryInfo ref="queryInfoRef" />
</template>
<script lang="ts" setup name="DbTableOpen">
  import { Divider } from 'ant-design-vue';
  import { nextTick, ref, toRefs } from 'vue';
  import DbQueryInfo from './DbQueryInfo.vue';

  const queryInfoRef = ref<InstanceType<typeof DbQueryInfo>>();
  const sql = ref('');

  const props = defineProps({
    tableOpenData: {
      type: Object,
      required: true,
    },
  });

  const { tableOpenData } = toRefs(props);
  sql.value = `select * from ${tableOpenData.value.tableName} limit 100;`;

  console.log(tableOpenData);

  nextTick(() => {
    console.log(sql);
    queryInfoRef.value?.handleSqlQuery(
      tableOpenData.value.item,
      tableOpenData.value.schemaName,
      sql.value,
    );
  });
</script>
