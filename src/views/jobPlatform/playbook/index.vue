<template>
  <PageWrapper dense contentClass="flex" class="m-4">
    <Card class="w-full" v-loading="loadingRef">
      <div class="flex ring-1 ring-gray-200 ring-offset-11 rounded">
        <div class="w-2/3 xl:w-3/5">
          <p class="font-bold">执行脚本</p>
          <BasicForm style="margin-left: -37px" @register="registerForm" @submit="handleSubmit" />
        </div>
        <Divider type="vertical" style="height: 85vh; margin: 0 14px" dashed />
        <CodeEditor
          class="w-1/3 xl:w-2/5 h-190"
          :lineNumbers="false"
          :mode="codeMode"
          readonly
          v-model:value="execResult"
        />
      </div>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup name="PlaybookManagement">
  import { Divider, Card } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { CodeEditor, MODE } from '/@/components/CodeEditor';
  import { ref } from 'vue';
  import { ExecTask, getScriptInfo, getScriptOptions } from '/@/api/job/job';
  import { getHostGroupData } from '/@/api/cmdb/hostGroup';

  const codeMode = ref(MODE.HTML);
  const loadingRef = ref(false);
  const execResult = ref('');

  const playbookFormSchema: FormSchema[] = [
    {
      field: 'host_group_id',
      label: '主机组',
      component: 'ApiTreeSelect',
      componentProps: {
        api: getHostGroupData,
        resultField: 'items',
        fieldNames: {
          label: 'name',
          key: 'id',
          value: 'id',
        },
        getPopupContainer: () => document.body,
      },
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'exec_command',
      label: '执行命令',
      component: 'Select',
      componentProps: () => {
        return {
          options: [
            { label: 'shell', value: 'shell' },
            { label: 'python2', value: 'py2' },
            { label: 'python3', value: 'py3' },
            { label: 'go', value: 'go' },
            { label: 'playbook', value: 'ansible' },
          ],
          onChange: (e) => {
            updateContentLanguage(e);
          },
        };
      },
      required: true,
      colProps: { span: 12 },
    },
    {
      field: 'host_pattern',
      label: '限制',
      component: 'Input',
      required: false,
      componentProps: {
        placeholder: '请输入通配符*或IP',
      },
      colProps: { span: 15 },
    },
    {
      field: 'script_id',
      label: '选择现有脚本',
      required: false,
      component: 'ApiSelect',
      componentProps: () => {
        return {
          api: getScriptOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
          onChange: (e) => {
            console.log(e);
            setScript(e);
          },
        };
      },
      colProps: { span: 9 },
    },
    {
      field: 'content',
      label: '内容',
      component: 'Editor',
      required: true,
      componentProps: {
        height: '60vh',
        theme: 'vs-dark',
        defaultLanguage: 'shell',
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
    },
  ];

  const [registerForm, { setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: playbookFormSchema,
    showActionButtonGroup: true,
    actionColOptions: { span: 23 },
    submitButtonOptions: { text: '执行' },
  });

  const handleSubmit = async () => {
    loadingRef.value = true;
    try {
      const values = await validate();
      console.log(values);
      ExecTask({ ...values })
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

  const setScript = async (value) => {
    loadingRef.value = true;
    getScriptInfo(value)
      .then((resp) => {
        setFieldsValue({ exec_command: resp.exec_command, content: resp.content });
        updateContentLanguage(resp.exec_command);
      })
      .catch(() => {})
      .finally(() => {
        loadingRef.value = false;
      });
  };

  const updateContentLanguage = (exec_command: string) => {
    let language = 'shell';
    if (exec_command === 'ansible') {
      language = 'yaml';
    } else if (exec_command.startsWith('py')) {
      language = 'python';
    } else if (exec_command === 'go') {
      language = 'go';
    }
    updateSchema([
      {
        field: 'content',
        componentProps: {
          language: language,
        },
      },
    ]);
  };
</script>
