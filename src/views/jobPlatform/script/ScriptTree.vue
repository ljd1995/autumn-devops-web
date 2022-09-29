<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="脚本列表"
      ref="treeRef"
      toolbar
      search
      show-line
      show-icon
      :clickRowToExpand="false"
      :treeData="treeData"
      :actionList="actionList"
      @select="handleSelect"
    />
    <ScriptModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, h, nextTick, onMounted, ref, unref } from 'vue';
  import { BasicTree, TreeActionItem, TreeActionType, TreeItem } from '/@/components/Tree';
  import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons-vue/lib/icons';
  import { useModal } from '/@/components/Modal';
  import ScriptModal from './ScriptModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Modal } from 'ant-design-vue';
  import { getScriptGroupData, deleteScript } from '/@/api/job/job';

  export default defineComponent({
    name: 'ScriptTree',
    components: { BasicTree, ScriptModal },

    emits: ['select'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const [registerModal, { openModal }] = useModal();
      const { createMessage } = useMessage();

      async function fetch() {
        treeData.value = (await getScriptGroupData()) as unknown as TreeItem[];
        // 展开全部
        nextTick(() => {
          console.log(unref(treeRef));
          unref(treeRef)?.expandAll(true);
        });
      }

      function handleSelect(keys) {
        emit('select', keys[0]);
      }
      function handleCreate(node: any) {
        openModal(true, {
          node,
          isUpdate: false,
        });
      }
      function handleEdit(node: any) {
        openModal(true, {
          node,
          isUpdate: true,
        });
      }
      function handleDelete(node: any) {
        console.log('delete', node);
        Modal.confirm({
          title: '是否确认删除该脚本或脚本组',
          okText: '确认',
          cancelText: '取消',
          centered: true,
          width: 260,
          onOk() {
            deleteScript(node.id)
              .then(() => {
                createMessage.success('删除成功');
                fetch();
              })
              .catch((err) => {
                createMessage.success('删除失败' + err.message);
              });
          },
        });
      }

      const actionList: TreeActionItem[] = [
        {
          render: (node) => {
            return h(EditOutlined, {
              class: 'ml-2 mr-1',
              onClick: () => {
                handleEdit(node);
              },
            });
          },
        },
        {
          render: (node) => {
            return h(PlusOutlined, {
              class: 'mr-1',
              onClick: () => {
                handleCreate(node);
              },
            });
          },
        },
        {
          render: (node) => {
            return h(DeleteOutlined, {
              class: 'mr-2',
              onClick: () => {
                handleDelete(node);
              },
            });
          },
        },
      ];
      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          createMessage.success('更新成功');
        } else {
          createMessage.success('新增成功');
        }
        fetch();
      }

      onMounted(() => {
        fetch();
      });
      return { treeData, treeRef, handleSelect, registerModal, handleSuccess, actionList };
    },
  });
</script>
