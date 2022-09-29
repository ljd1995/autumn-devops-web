<template>
  <div class="overflow-hidden bg-white left-tree">
    <BasicTree
      title="主机列表"
      ref="treeRef"
      toolbar
      search
      show-line
      show-icon
      clickRowToExpand
      :treeData="treeData"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref, unref } from 'vue';
  import { BasicTree, TreeActionType, TreeItem } from '/@/components/Tree';
  import { getHostGroupDataWithHost } from '/@/api/cmdb/hostGroup';

  export default defineComponent({
    name: 'HostTree',
    components: { BasicTree },

    emits: ['select'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);
      const treeRef = ref<Nullable<TreeActionType>>(null);

      async function fetch() {
        treeData.value = (await getHostGroupDataWithHost()) as unknown as TreeItem[];
        // 展开全部
        nextTick(() => {
          unref(treeRef)?.expandAll(true);
        });
      }

      function handleSelect(keys) {
        emit('select', keys[0]);
      }

      onMounted(() => {
        fetch();
      });
      return { treeData, treeRef, handleSelect };
    },
  });
</script>
<style scoped>
  .left-tree {
    height: 100vh;
  }
</style>
