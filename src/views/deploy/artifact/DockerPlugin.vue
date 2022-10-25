<template>
  <BasicForm @register="register" @submit="handleSubmit" />
</template>
<script lang="ts" setup name="HelmPlugin">
  import { toRefs, watchEffect } from 'vue';
  import { getDeployConfigPageList } from '/@/api/cmdb/deployConfig';
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
      field: 'image_tag',
      label: '镜像tag',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'config_id',
      label: '镜像仓库',
      required: true,
      component: 'ApiSelect',
      componentProps: {
        api: getDeployConfigPageList,
        params: {
          page: 1,
          page_size: 100,
          type: 'docker_registry',
        },
        resultField: 'items',
        labelField: 'name',
        valueField: 'id',
      },
      colProps: { span: 24 },
    },
    {
      field: 'image_name',
      label: '镜像名称',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'module_name',
      label: '模块名称',
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
