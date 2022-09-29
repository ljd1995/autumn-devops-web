<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { scriptFormSchema } from './script.data';
  import { getScriptGroupData, createScript, updateScript } from '/@/api/job/job';

  export default defineComponent({
    name: 'ScriptModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: scriptFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        const treeData = await getScriptGroupData();
        if (unref(isUpdate)) {
          rowId.value = data.node.id;
          setFieldsValue({
            ...data.node,
          });
          updateSchema([
            {
              field: 'parent_id',
              componentProps: { treeData, disabled: false },
            },
          ]);
        } else {
          setFieldsValue({
            parent_id: data.node.id,
          });
          updateSchema([
            {
              field: 'parent_id',
              componentProps: { treeData, disabled: true },
            },
          ]);
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增脚本或脚本组' : '编辑脚本或脚本组'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (!unref(isUpdate)) {
            await createScript({ ...values });
          } else {
            await updateScript(rowId.value, { ...values });
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
