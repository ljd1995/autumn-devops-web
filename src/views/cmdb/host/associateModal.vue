<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="关联主机组" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { associateFormSchema } from './host.data';
  import { getHostGroupData } from '/@/api/cmdb/hostGroup';
  import { associateHostGroup } from '/@/api/cmdb/host';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'AssociateModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const hostIds = ref([]);
      const { createMessage } = useMessage();
      const [registerForm, { updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: associateFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        hostIds.value = data.keys;
        setModalProps({ confirmLoading: false });
        const treeData = await getHostGroupData({});
        updateSchema([
          {
            field: 'host_group_id',
            componentProps: { treeData },
          },
        ]);
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          associateHostGroup({ ...values, host_ids: hostIds.value })
            .then(() => {
              createMessage.success('更新主机组成功');
            })
            .catch(() => {
              createMessage.success('更新主机组失败');
            });
          closeModal();
          emit('success');
        } catch (e) {
          console.log(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, handleSubmit };
    },
  });
</script>
