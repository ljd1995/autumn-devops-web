<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { dbFormSchema } from './db.data';
  import { createDb, updateDb } from '/@/api/cmdb/db';
  import { AesEncryption } from '/@/utils/cipher';
  import { AesEnum } from '/@/enums/cipherEnum';

  export default defineComponent({
    name: 'DbModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: dbFormSchema,
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
            admin_password: aes.decryptByAES(data.record.admin_password),
            query_password: aes.decryptByAES(data.record.query_password),
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增数据库信息' : '编辑数据库信息'));

      async function handleSubmit() {
        try {
          const values = await validate();
          console.log(values);
          values.admin_password = aes.encryptByAES(values.admin_password);
          values.query_password = aes.encryptByAES(values.query_password);
          setModalProps({ confirmLoading: true });
          if (!unref(isUpdate)) {
            await createDb({ ...values });
          } else {
            await updateDb(rowId.value, { ...values });
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
