<template>
  <BasicForm @register="register" @submit="handleSubmit" />
</template>
<script lang="ts" setup name="SqlPlugin">
  import { toRefs, watchEffect } from 'vue';
  import { getDbPageList } from '/@/api/cmdb/db';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';

  const emit = defineEmits(['submit', 'register']);

  const props = defineProps({
    formData: {
      type: Object,
    },
  });

  const { formData } = toRefs(props);

  const formSchema: FormSchema[] = [
    {
      field: 'name',
      label: '插件别名',
      component: 'Input',
      required: false,
      colProps: { span: 24 },
    },
    {
      field: 'db_id',
      label: '数据库',
      required: true,
      component: 'ApiSelect',
      componentProps: {
        api: getDbPageList,
        params: {
          page: 1,
          page_size: 100,
          type: 'git',
        },
        resultField: 'items',
        labelField: 'remark',
        valueField: 'id',
      },
      colProps: { span: 24 },
    },
    {
      field: 'sql',
      label: 'sql',
      component: 'Editor',
      required: true,
      componentProps: {
        height: '60vh',
        theme: 'vs-dark',
        defaultLanguage: 'sql',
        options: {
          wordWrap: true, // on,off
          foldingStrategy: 'indentation', // 代码可分小段折叠
          automaticLayout: true, // 自适应布局
          overviewRulerBorder: true, // 不要滚动条的边框
          autoClosingBrackets: true,
          mouseWheelZoom: true,
          tabSize: 4, // tab 缩进长度
          fontSize: 17,
          minimap: {
            enabled: true, // 不要小地图
          },
          lineNumbers: true, // on,off
        },
        getPopupContainer: () => document.body,
      },
      colProps: { span: 24 },
    },
  ];

  const [register, { validate, setFieldsValue }] = useForm({
    labelWidth: 120,
    baseColProps: {
      span: 24,
    },
    schemas: formSchema,
    showActionButtonGroup: true,
    actionColOptions: {
      span: 24,
    },
    submitButtonOptions: { text: '保存' },
  });

  const handleSubmit = async () => {
    const values = await validate();
    emit('submit', { values });
  };

  watchEffect(() => {
    if (formData?.value) {
      setFieldsValue({
        ...formData.value,
      });
    }
  });
</script>
