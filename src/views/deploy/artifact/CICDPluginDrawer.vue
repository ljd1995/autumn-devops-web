<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    width="45%"
    showFooter
    @ok="handleOk"
  >
    <BasicForm @register="registerForm" />
    <BasicTable @register="registerTable" />
  </BasicDrawer>
</template>
<script lang="ts" setup name="CICDPluginDrawer">
  import { computed, ref, unref } from 'vue';
  import { cicdPluginColumns, pipelineFormSchema } from './artifact.data';
  import { getCICDPluginPageList } from '/@/api/deploy/cicd';
  import { CICDPluginListItem } from '/@/api/deploy/model/cicdModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTable, useTable } from '/@/components/Table';

  const emit = defineEmits(['check', 'register']);

  const isUpdate = ref(false);
  const rowIndex = ref(0);

  const pluginList = ref<CICDPluginListItem[]>([]);

  const [registerForm, { resetFields, validate, setFieldsValue, updateSchema }] = useForm({
    labelWidth: 110,
    baseColProps: { span: 24 },
    schemas: pipelineFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    pluginList.value = data?.pluginList;
    isUpdate.value = !!data?.isUpdate;
    rowIndex.value = data?.index;
    console.log(data?.envGroups);
    const envOptions = data?.envGroups.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
    updateSchema([
      {
        field: 'envName',
        componentProps: { options: envOptions },
      },
    ]);
  });

  const [registerTable, { getSelectRows }] = useTable({
    title: '插件列表',
    titleHelpMessage: '这里只能新增插件，删除插件请使用主页面的排序功能',
    api: getCICDPluginPageList,
    rowKey: 'id',
    columns: cicdPluginColumns,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    bordered: true,
    striped: true,
    rowSelection: { type: 'checkbox' },
    handleSearchInfoFn(info) {
      console.log('handleSearchInfoFn', info);
      return info;
    },
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增流水线' : '编辑流水线'));

  const handleOk = async () => {
    const values = await validate();
    const rows = getSelectRows();
    emit('check', {
      isUpdate: unref(isUpdate),
      values: { ...values, rows: rows },
      index: unref(rowIndex),
    });
    closeDrawer();
  };
</script>
<style lang="less"></style>
