<template>
  <BasicForm @register="register" @submit="handleSubmit" />
</template>
<script lang="ts" setup name="GitPlugin">
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
      field: 'git_url',
      label: 'git地址',
      component: 'Input',
      required: true,
      colProps: { span: 24 },
    },
    {
      field: 'config_id',
      label: 'git token',
      required: true,
      component: 'ApiSelect',
      componentProps: {
        api: getDeployConfigPageList,
        params: {
          page: 1,
          page_size: 100,
          type: 'git',
        },
        resultField: 'items',
        labelField: 'name',
        valueField: 'id',
      },
      colProps: { span: 24 },
    },
    {
      field: 'branch_name',
      label: '分支名称',
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
