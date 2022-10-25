<template>
  <BasicForm @register="register" @submit="handleSubmit" />
</template>
<script lang="ts" setup name="ConfigPlugin">
  import { toRefs, watchEffect } from 'vue';
  import { getConfigCenterPageList } from '/@/api/cmdb/configCenter';
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
      field: 'config_center_id',
      label: '配置中心',
      required: true,
      component: 'ApiSelect',
      componentProps: {
        api: getConfigCenterPageList,
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
      field: 'key',
      label: 'key',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'group',
      label: 'group',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'content',
      label: '值',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'data_id',
      label: 'dataId',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'namespace',
      label: '命名空间',
      component: 'Input',
      required: true,
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
