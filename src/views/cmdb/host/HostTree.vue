<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="主机组列表"
      ref="treeRef"
      toolbar
      search
      show-line
      show-icon
      clickRowToExpand
      :treeData="treeData"
      :actionList="actionList"
      @select="handleSelect"
    />
    <HostGroupModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, h, nextTick, onMounted, ref, unref, withModifiers } from 'vue';
  import { BasicTree, TreeActionItem, TreeActionType, TreeItem } from '/@/components/Tree';
  import { deleteHostGroup, getHostGroupData } from '/@/api/cmdb/hostGroup';
  import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons-vue/lib/icons';
  import { useModal } from '/@/components/Modal';
  import HostGroupModal from './HostGroupModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Modal } from 'ant-design-vue';

  export default defineComponent({
    name: 'HostTree',
    components: { BasicTree, HostGroupModal },

    emits: ['select'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const [registerModal, { openModal }] = useModal();
      const { createMessage } = useMessage();

      async function fetch() {
        treeData.value = (await getHostGroupData({})) as unknown as TreeItem[];
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
          title: '是否确认删除该主机组',
          okText: '确认',
          cancelText: '取消',
          centered: true,
          width: 260,
          onOk() {
            deleteHostGroup(node.id)
              .then(() => {
                createMessage.success('删除主机组成功');
                fetch();
              })
              .catch((err) => {
                createMessage.success('删除主机组失败' + err.message);
              });
          },
        });
      }

      const actionList: TreeActionItem[] = [
        {
          render: (node) => {
            return h(EditOutlined, {
              class: 'ml-2 mr-1',
              onClick: withModifiers(() => {
                handleEdit(node);
              }, ['stop']),
            });
          },
        },
        {
          render: (node) => {
            return h(PlusOutlined, {
              class: 'mr-1',
              onClick: withModifiers(() => {
                handleCreate(node);
              }, ['stop']),
            });
          },
        },
        {
          render: (node) => {
            return h(DeleteOutlined, {
              class: 'mr-2',
              onClick: withModifiers(() => {
                handleDelete(node);
              }, ['stop']),
            });
          },
        },
      ];
      function handleSuccess({ isUpdate }) {
        if (isUpdate) {
          createMessage.success('更新主机组成功');
        } else {
          createMessage.success('新增主机组成功');
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
