<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <div class="w-1/4 xl:w-1/5 bg-gray-100">
      <DbList @design="handleDesign" @table="handleTable" @open="handleTableOpen" />
    </div>
    <div class="w-3/4 xl:w-4/5 bg-light-50">
      <Tabs
        v-model:activeKey="activeKey"
        type="editable-card"
        @edit="onEdit"
        size="small"
        @change="handleTabChange"
      >
        <TabPane
          v-for="pane in panes"
          :key="pane.key"
          :tab="pane.title"
          :closable="pane.closable"
          forceRender
        >
          <!-- <component :key="comKey" :is="currentCompoent[current]" v-bind="{ ...pane.content }" /> -->
          <div v-if="current === 'design'">
            <DbColumn :columnData="columnData" />
          </div>
          <div v-else-if="current === 'table'">
            <DbTable :tableData="tableData" />
          </div>
          <div v-else-if="current === 'query'">
            <DbQuery />
          </div>
          <div v-else-if="current === 'open'">
            <DbTableOpen :tableOpenData="tableOpenData" />
          </div>
        </TabPane>
      </Tabs>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup name="DbOperator">
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { onMounted, reactive, ref, unref } from 'vue';
  import DbList from './DbList.vue';
  import DbTable from './DbTable.vue';
  import DbQuery from './DbQuery.vue';
  import DbColumn from './DbColumn.vue';
  import DbTableOpen from './DbTableOpen.vue';

  const tableData = ref([]);
  const columnData = ref([]);
  const tableOpenData = ref({});
  // const currentCompoent = reactive({
  //   table: markRaw(defineAsyncComponent(() => import('./DbTable.vue'))),
  //   design: markRaw(defineAsyncComponent(() => import('./DbColumn.vue'))),
  //   query: markRaw(defineAsyncComponent(() => import('./DbQuery.vue'))),
  // });

  const current = ref('table');
  const panes = ref<{ title: string; content: object; key: string; closable?: boolean }[]>(
    new Array(1).fill(null).map((_, index) => {
      const id = String(index + 1);
      return {
        title: '对象',
        content: { data: tableData },
        key: `table-${id}`,
        closable: false,
      };
    }),
  );
  const activeKey = ref(panes.value[0].key);
  const newTabIndex = ref(0);
  const columnDatas = reactive({});

  const handleDesign = (items) => {
    columnData.value = items.data;
    current.value = 'design';
    let title = `${items.tableName}@${items.schemaName}(${items.connName})`;
    add(title, 'design', { data: columnData });
  };

  const handleTable = (items) => {
    tableData.value = items;
    current.value = 'table';
    activeKey.value = 'table-1';
  };

  const handleTableOpen = (items) => {
    tableOpenData.value = items;
    current.value = 'open';
    let title = `${items.tableName}@${items.schemaName}(${items.connName})`;
    add(title, 'open', { data: tableOpenData });
  };

  const add = (title, key_type, content) => {
    activeKey.value = `${key_type}-${newTabIndex.value++}`;
    panes.value.push({
      title: title,
      content: content,
      key: activeKey.value,
    });
    columnDatas[activeKey.value] = unref(content.data);
  };

  const remove = (targetKey: string) => {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    panes.value = panes.value.filter((pane) => pane.key !== targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
      if (lastIndex >= 0) {
        activeKey.value = panes.value[lastIndex].key;
      } else {
        activeKey.value = panes.value[0].key;
      }
    }
  };

  const onEdit = (targetKey: string | MouseEvent, action: string) => {
    console.log(targetKey);
    if (action === 'add') {
      current.value = 'query';
      add('sql查询', 'query', {});
    } else {
      remove(targetKey as string);
    }
  };

  const handleTabChange = (activeKey: string) => {
    console.log(activeKey);
    if (activeKey.indexOf('query') != -1) {
      current.value = 'query';
    } else if (activeKey.indexOf('table') != -1) {
      current.value = 'table';
    } else if (activeKey.indexOf('open') != -1) {
      current.value = 'open';
    } else if (activeKey.indexOf('design') != -1) {
      current.value = 'design';
      columnData.value = columnDatas[activeKey];
      console.log(columnDatas[activeKey]);
    }
  };

  onMounted(() => {});
</script>
