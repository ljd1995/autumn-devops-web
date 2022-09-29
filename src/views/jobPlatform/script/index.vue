<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <ScriptTree class="w-1/5 xl:w-1/6" @select="handleSelect" />
    <div class="w-4/5 xl:w-5/6 m-4" v-loading="loadingRef">
      <Card>
        <Empty v-show="isShowEmpty" />
        <div v-show="!isShowEmpty">
          <div class="text-xs text-right font-thin">
            <Row>
              <Col :span="22">
                <div>
                  <p
                    >由 <span class="text-yellow-500 font-medium">{{ create_user }}</span> 于<span
                      class="text-green-500 font-medium"
                      >{{ create_time }}</span
                    >创建</p
                  >
                  <p class="-mt-2"
                    >最近一次修改于<span class="text-green-500 font-medium">{{ update_time }}</span
                    >，由 <span class="text-yellow-500 font-medium">{{ update_user }}</span> 更新</p
                  >
                </div></Col
              >
              <Col :span="2">
                <a-button
                  type="text"
                  preIcon="ant-design:history-outlined"
                  @click="handleHistoryClick"
                  >更新历史</a-button
                ></Col
              >
            </Row>
          </div>
          <BasicForm style="margin-left: -30px" @register="registerForm" @submit="handleSubmit" />
        </div>
      </Card>
    </div>
    <ScriptDrawer @register="registerDrawer" @compare="handleCompare" />
    <ScriptDiffDrawer @register="registerDiffDrawer" />
  </PageWrapper>
</template>
<script lang="ts" setup name="ScriptManagement">
  import { PageWrapper } from '/@/components/Page';
  import ScriptTree from './ScriptTree.vue';
  import { Card, Empty, Row, Col } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { nextTick, ref } from 'vue';
  import {
    getScriptGroupData,
    getScriptHistory,
    getScriptInfo,
    updateScript,
  } from '/@/api/job/job';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ScriptDrawer from './ScriptDrawer.vue';
  import ScriptDiffDrawer from './ScriptDiffDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';

  const loadingRef = ref(false);
  const isShowEmpty = ref(true);
  const nodeId = ref(0);
  const nodeName = ref('');
  const create_user = ref('');
  const create_time = ref('');
  const update_user = ref('');
  const update_time = ref('');

  const { createMessage } = useMessage();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDiffDrawer, methods] = useDrawer();

  const scriptUpdateFormSchema: FormSchema[] = [
    {
      field: 'name',
      label: '脚本名称',
      component: 'Input',
      required: true,
      componentProps: {
        placeholder: '请输入脚本名称',
      },
      colProps: { span: 24 },
    },
    {
      field: 'exec_command',
      label: '执行命令',
      component: 'Select',
      required: true,
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
      colProps: { span: 8 },
    },
    {
      field: 'node_type',
      label: '节点类型',
      component: 'Select',
      required: true,
      componentProps: {
        options: [
          { label: '脚本组', value: 'group' },
          { label: '脚本', value: 'node' },
        ],
      },
      colProps: { span: 8 },
    },
    {
      field: 'parent_id',
      label: '脚本组',
      component: 'ApiTreeSelect',
      componentProps: {
        api: getScriptGroupData,
        resultField: 'items',
        fieldNames: {
          label: 'name',
          key: 'id',
          value: 'id',
        },
        getPopupContainer: () => document.body,
      },
      required: true,
      colProps: { span: 8 },
    },
    {
      field: 'content',
      label: '内容',
      component: 'Editor',
      required: true,
      componentProps: {
        height: '50vh',
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
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
      required: false,
    },
  ];

  const [registerForm, { setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: scriptUpdateFormSchema,
    showActionButtonGroup: true,
    actionColOptions: { span: 23 },
    submitButtonOptions: { text: '保存' },
  });

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

  const handleSelect = async (value) => {
    if (value) {
      loadingRef.value = true;
      getScriptInfo(value)
        .then((resp) => {
          if (resp.node_type === 'group') {
            isShowEmpty.value = true;
          } else {
            nextTick(() => {
              setFieldsValue({ ...resp });
              create_user.value = resp.create_user as string;
              create_time.value = resp.create_time as string;
              update_user.value = resp.update_user as string;
              update_time.value = resp.update_time as string;
              updateContentLanguage(resp.exec_command);
              nodeId.value = resp.id as number;
              nodeName.value = resp.name as string;
              isShowEmpty.value = false;
            });
          }
        })
        .catch((err) => {})
        .finally(() => {
          loadingRef.value = false;
        });
    }
  };

  const handleSubmit = async () => {
    loadingRef.value = true;
    try {
      const values = await validate();
      console.log(values);
      updateScript(nodeId.value, { ...values })
        .then((resp) => {
          console.log(resp);
          createMessage.success('脚本保存成功');
        })
        .catch(() => {
          createMessage.error('脚本保存失败');
        })
        .finally(() => {
          loadingRef.value = false;
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleHistoryClick = () => {
    console.log('handleHistoryClick');
    getScriptHistory(nodeId.value)
      .then((resp) => {
        openDrawer(true, { items: resp, nodeName: nodeName.value });
      })
      .catch(() => {
        createMessage.error('脚本更新历史获取失败');
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  const handleCompare = (item) => {
    console.log('test', item);
    methods.openDrawer(true, {
      oldContent: item.oldContent,
      newContent: item.newContent,
      nodeName: nodeName.value,
    });
  };
</script>
