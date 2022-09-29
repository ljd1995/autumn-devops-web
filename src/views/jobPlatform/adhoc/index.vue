<template>
  <PageWrapper dense contentClass="flex" class="m-4">
    <Card class="w-full" v-loading="loadingRef">
      <div class="flex ring-1 ring-gray-200 ring-offset-11 rounded">
        <div class="w-1/3 xl:w-2/5">
          <p class="font-bold">执行命令</p>
          <BasicForm style="margin-left: -37px" @register="registerForm" @submit="handleSubmit" />
        </div>
        <Divider type="vertical" style="height: 300px; margin: 0 14px" dashed />
        <CodeEditor
          class="w-2/3 xl:w-3/5 h-80"
          :lineNumbers="false"
          :mode="codeMode"
          readonly
          v-model:value="execResult"
        />
      </div>
      <Divider />
      <AdhocHistory @use="handleUse" class="ring-1 ring-gray-200 ring-offset-11 rounded" />
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup name="AdhocManagement">
  import { Divider, Card } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { adhocFormSchema } from './adhoc.data';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { ref } from 'vue';
  import { ExecModule } from '/@/api/job/job';
  import AdhocHistory from './AdhocHistory.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const codeMode = ref(MODE.HTML);
  const loadingRef = ref(false);
  const execResult = ref('');

  const { createMessage } = useMessage();

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: adhocFormSchema,
    showActionButtonGroup: true,
    actionColOptions: { span: 23 },
    submitButtonOptions: { text: '执行' },
  });

  const handleSubmit = async () => {
    loadingRef.value = true;
    try {
      const values = await validate();
      console.log(values);
      ExecModule({ ...values })
        .then((resp) => {
          console.log(resp);
          execResult.value = resp;
        })
        .catch(() => {})
        .finally(() => {
          loadingRef.value = false;
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleUse = (record) => {
    resetFields();
    setFieldsValue({
      ...record,
      host_group_id: record.host_group.id,
    });
    let osTop = document.documentElement.scrollTop || document.body.scrollTop;
    document.documentElement.scrollTop = document.body.scrollTop = osTop - 1200;
    createMessage.success('已使用该记录');
  };
</script>
