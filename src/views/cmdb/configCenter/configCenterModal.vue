<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './configCenter.data';
  import { AesEncryption } from '/@/utils/cipher';
  import { AesEnum } from '/@/enums/cipherEnum';
  import { createConfigCenter, updateConfigCenter } from '/@/api/cmdb/configCenter';

  export default defineComponent({
    name: 'ConfigCenterModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
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
          setFieldsValue({
            ...data.record,
            password: aes.decryptByAES(data.record.password),
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增配置中心' : '编辑配置中心'));

      async function handleSubmit() {
        try {
          const values = await validate();
          values.password = aes.encryptByAES(values.password);
          setModalProps({ confirmLoading: true });
          if (!unref(isUpdate)) {
            await createConfigCenter({ ...values });
          } else {
            await updateConfigCenter(rowId.value, { ...values });
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
