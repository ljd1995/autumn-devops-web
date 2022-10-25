<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { createDeployConfig, updateDeployConfig } from '/@/api/cmdb/deployConfig';
  import { AesEncryption } from '/@/utils/cipher';
  import { AesEnum } from '/@/enums/cipherEnum';

  export default defineComponent({
    name: 'DeployConfigModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const isDockerShow = ref(false);
      const isK8sShow = ref(true);
      const isGitShow = ref(false);

      const formSchema: FormSchema[] = [
        {
          field: 'name',
          label: '名称',
          component: 'Input',
          required: true,
        },
        {
          field: 'type',
          label: '类型',
          component: 'Select',
          required: true,
          defaultValue: 'k8s',
          componentProps: () => {
            return {
              options: [
                { label: 'k8s', value: 'k8s' },
                { label: '镜像仓库', value: 'docker_registry' },
                { label: 'Git', value: 'git' },
              ],
              onChange: (e) => {
                if (e == 'docker_registry') {
                  isDockerShow.value = true;
                  isGitShow.value = false;
                  isK8sShow.value = false;
                } else if (e == 'k8s') {
                  isDockerShow.value = false;
                  isGitShow.value = false;
                  isK8sShow.value = true;
                } else if (e == 'git') {
                  isDockerShow.value = false;
                  isGitShow.value = true;
                  isK8sShow.value = false;
                }
              },
            };
          },
        },
        {
          label: 'git访问token',
          field: 'token',
          component: 'Input',
          required: true,
          ifShow: () => {
            return isGitShow.value;
          },
        },
        {
          label: '镜像仓库地址',
          field: 'registry',
          component: 'Input',
          required: true,
          ifShow: () => {
            return isDockerShow.value;
          },
        },
        {
          label: '镜像仓库用户名',
          field: 'username',
          component: 'Input',
          required: true,
          ifShow: () => {
            return isDockerShow.value;
          },
        },
        {
          label: '镜像仓库密码',
          field: 'password',
          component: 'Input',
          required: true,
          ifShow: () => {
            return isDockerShow.value;
          },
        },
        {
          label: 'K8s地址',
          field: 'address',
          component: 'Input',
          required: true,
          ifShow: () => {
            return isK8sShow.value;
          },
        },
        {
          label: 'K8s config',
          field: 'config_yaml',
          component: 'InputTextArea',
          required: true,
          ifShow: () => {
            return isK8sShow.value;
          },
        },
        {
          label: '备注',
          field: 'remark',
          component: 'Input',
        },
      ];

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 140,
        baseColProps: { span: 24 },
        schemas: formSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const aes = new AesEncryption({ key: AesEnum.KEY, iv: AesEnum.IV });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          const recordType = data.record.type;

          if (recordType != 'k8s') {
            isK8sShow.value = false;
          }
          if (recordType === 'docker_registry') {
            isDockerShow.value = true;
          }
          if (recordType === 'git') {
            isGitShow.value = true;
          }

          setFieldsValue({
            ...data.record,
            ...data.record.parameters,
          });

          if (data.record?.parameters?.token) {
            setFieldsValue({
              token: aes.decryptByAES(data.record.parameters?.token),
            });
          }
          if (data.record?.parameters?.password) {
            setFieldsValue({
              password: aes.decryptByAES(data.record.parameters?.password),
            });
          }
        } else {
          isDockerShow.value = false;
          isGitShow.value = false;
          isK8sShow.value = true;
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增部署配置' : '编辑部署配置'));

      async function handleSubmit() {
        try {
          const values = await validate();
          const recordType = values.type;
          setModalProps({ confirmLoading: true });
          let parameters = {};

          if (recordType === 'k8s') {
            parameters['address'] = values.address;
            parameters['config_yaml'] = values.config_yaml;
          }
          if (recordType === 'docker_registry') {
            parameters['registry'] = values.registry;
            parameters['username'] = values.username;
            parameters['password'] = aes.encryptByAES(values.password);
          }
          if (recordType === 'git') {
            parameters['token'] = aes.encryptByAES(values.token);
          }

          if (!unref(isUpdate)) {
            await createDeployConfig({
              name: values.name,
              remark: values.remark,
              parameters: parameters,
              type: values.type,
            });
          } else {
            await updateDeployConfig(rowId.value, {
              name: values.name,
              remark: values.remark,
              parameters: parameters,
              type: values.type,
            });
          }
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } catch (e) {
          console.log(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
