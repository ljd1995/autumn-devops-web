<template>
  <div class="overflow-hidden bg-white left-tree" v-loading="loadingRef">
    <BasicTree
      title="Wiki目录与页面列表"
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
    <CategoryModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, onMounted, h, ref, unref, withModifiers } from 'vue';
  import { deleteWikiCategory, getWikiCategoryDataWithPage } from '/@/api/wiki/wikiCategory';
  import { BasicTree, TreeActionItem, TreeActionType, TreeItem } from '/@/components/Tree';
  import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons-vue/lib/icons';
  import { Modal } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import CategoryModal from './CategoryModal.vue';
  import { deleteWikiPage } from '/@/api/wiki/wikiPage';

  export default defineComponent({
    name: 'CategoryTree',
    components: { BasicTree, CategoryModal },
    props: {
      zoneId: {
        type: String,
      },
    },
    emits: ['select'],
    setup(props, { emit }) {
      const zoneId = props.zoneId as string;
      const treeData = ref<TreeItem[]>([]);
      const treeRef = ref<Nullable<TreeActionType>>(null);
      const loadingRef = ref(false);

      const { createMessage } = useMessage();

      const [registerModal, { openModal }] = useModal();

      async function fetch() {
        loadingRef.value = true;
        treeData.value = (await getWikiCategoryDataWithPage(zoneId)) as unknown as TreeItem[];
        // 展开全部
        nextTick(() => {
          unref(treeRef)?.expandAll(true);
          loadingRef.value = false;
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

      function handleCreate(node: any) {
        console.log(node);
        if (node.is_page) {
          createMessage.warning('wiki页面下不允许再新增页面');
          return;
        }
        openModal(true, {
          node,
          isUpdate: false,
          zoneId: zoneId,
        });
      }
      function handleEdit(node: any) {
        if (node.name === '根') {
          createMessage.warning('根节点不允许编辑');
          return;
        }
        openModal(true, {
          node,
          isUpdate: true,
          isPage: node.is_page,
          zoneId: zoneId,
        });
      }
      function handleDelete(node: any) {
        console.log('delete', node);
        if (node.is_page) {
          Modal.confirm({
            title: '是否确认删除该页面',
            okText: '确认',
            cancelText: '取消',
            centered: true,
            width: 260,
            onOk() {
              deleteWikiPage(node.page_id)
                .then(() => {
                  createMessage.success('删除wiki页面成功');
                  fetch();
                })
                .catch((err) => {
                  createMessage.success('删除wiki页面失败' + err.message);
                });
            },
          });
        } else {
          Modal.confirm({
            title: '是否确认删除该目录',
            okText: '确认',
            cancelText: '取消',
            centered: true,
            width: 260,
            onOk() {
              deleteWikiCategory(node.id)
                .then(() => {
                  createMessage.success('删除wiki目录成功');
                  fetch();
                })
                .catch((err) => {
                  createMessage.success('删除wiki目录失败' + err.message);
                });
            },
          });
        }
      }

      function handleSuccess({ isUpdate, isPage }) {
        if (isUpdate) {
          if (isPage) {
            createMessage.success('更新wiki页面成功');
          } else {
            createMessage.success('更新wiki目录成功');
          }
        } else {
          createMessage.success('新增成功');
        }
        fetch();
      }

      function handleSelect(keys) {
        emit('select', keys[0]);
      }

      onMounted(() => {
        fetch();
      });
      return {
        treeData,
        treeRef,
        handleSelect,
        actionList,
        registerModal,
        handleSuccess,
        loadingRef,
      };
    },
  });
</script>
<style scoped>
  .left-tree {
    height: 100vh;
  }
</style>
