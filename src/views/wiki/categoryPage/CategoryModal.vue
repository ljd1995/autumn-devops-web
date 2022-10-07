<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { wikiCategoryPageFormSchema } from './category.data';
  import {
    createWikiCategory,
    getWikiCategoryDataWithPage,
    updateWikiCategory,
  } from '/@/api/wiki/wikiCategory';
  import { createWikiPage, updateWikiPage } from '/@/api/wiki/wikiPage';

  export default defineComponent({
    name: 'CategoryModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const isPage = ref(false);
      const rowId = ref('');
      const zoneId = ref('');
      const page = reactive({
        id: '',
        content: '',
        secret: '',
      });

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 24 },
        schemas: wikiCategoryPageFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        isPage.value = !!data?.isPage;
        console.log(data.node);
        zoneId.value = data?.zoneId;
        if (unref(isPage)) {
          page.id = data.node.page_id;
          page.content = data.node.content;
          page.secret = data.node.secret;
        }

        const treeData = await getWikiCategoryDataWithPage(zoneId.value);

        if (unref(isUpdate)) {
          rowId.value = data.node.id;
          setFieldsValue({
            ...data.node,
          });
          if (!unref(isPage)) {
            setFieldsValue({
              type: 'category',
            });
          }
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

      const getTitle = computed(() => {
        if (!unref(isUpdate)) {
          return '新增wiki目录或页面';
        } else {
          if (!unref(isPage)) {
            return '编辑wiki目录';
          }
          return '编辑wiki页面';
        }
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          if (!unref(isUpdate)) {
            if (values.type == 'category') {
              await createWikiCategory({
                name: values.name,
                remark: values.remark,
                parent_id: values.parent_id,
                zone_id: zoneId.value,
              });
            } else {
              await createWikiPage({
                name: values.name,
                wiki_category_id: values.parent_id,
                remark: values.remark,
                content: '',
                secret: '',
              });
            }
          } else {
            if (!unref(isPage)) {
              await updateWikiCategory(rowId.value, { ...values, zone_id: zoneId.value });
            } else {
              console.log(page);
              await updateWikiPage(page.id, {
                name: values.name,
                wiki_category_id: values.parent_id,
                remark: values.remark,
                content: page.content,
                secret: page.secret,
              });
            }
          }
          closeModal();
          emit('success', {
            isUpdate: unref(isUpdate),
            isPage: unref(isPage),
            values: { ...values, id: rowId.value },
          });
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
