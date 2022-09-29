<template>
  <PageWrapper title="Wiki空间" v-loading="loadingRef">
    <template #headerContent>
      Wiki空间是资源集合的定义，在这里你可以创建需要分类区分的资源空间，点击空间将跳转到该空间下所拥有的页面
    </template>
    <div>
      <p class="float-right text-right cursor-pointer w-5 mr-3" @click="handleAdd"
        ><Icon icon="carbon:add-filled" size="24"
      /></p>
      <List :grid="{ gutter: 20, column: 4 }" :data-source="zoneList" class="clear-right">
        <template #renderItem="{ item }">
          <ListItem @click="handleZoneClick(item)">
            <Card :hoverable="true" :style="{ background: `url(${item.cover_image_url})` }">
              <div class="inline">
                <div
                  ><p class="font-bold text-light-500">{{ item.name }}</p
                  ><p class="text-pink-600 font-medium mt-7 -mb-4">{{ item.remark }}</p></div
                >
                <div class="text-right">
                  <Icon
                    icon="clarity:note-edit-line"
                    color="white"
                    class="p-1"
                    @click.stop="handleEdit(item)"
                  />
                  <span @click.stop="">
                    <Popconfirm
                      title="是否确认删除"
                      ok-text="确认"
                      cancel-text="取消"
                      @confirm.stop="handleDelete(item)"
                    >
                      <Icon icon="ant-design:delete-outlined" color="white" class="ml-4 p-1" />
                    </Popconfirm>
                  </span>
                </div>
              </div>
            </Card>
          </ListItem>
        </template>
      </List>
    </div>
    <ZoneModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="WikiZone">
  import { PageWrapper } from '/@/components/Page';
  import { Card, List, ListItem, Popconfirm } from 'ant-design-vue';
  import { deleteWikiZone, getWikiZonePageList } from '/@/api/wiki/wikiZone';
  import { onMounted, ref } from 'vue';
  import { WikiZoneListItem } from '/@/api/wiki/model/wikiZoneModel';
  import Icon from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import ZoneModal from './ZoneModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';

  let pageParams = {
    page: 1,
    page_size: 150,
  };

  const zoneList = ref<WikiZoneListItem[]>([]);
  const loadingRef = ref(false);
  const { createMessage } = useMessage();
  const router = useRouter();

  const [registerModal, { openModal }] = useModal();

  const fetch = () => {
    loadingRef.value = true;
    getWikiZonePageList({ ...pageParams })
      .then((res) => {
        zoneList.value = res.items;
      })
      .catch((err) => {})
      .finally(() => {
        loadingRef.value = false;
      });
  };

  const handleEdit = (record) => {
    console.log('edit click');
    openModal(true, {
      record,
      isUpdate: true,
    });
  };

  const handleDelete = (record) => {
    console.log('delete click');
    deleteWikiZone(record.id)
      .then(() => {
        createMessage.success('删除wiki空间成功');
        fetch();
      })
      .catch((err) => {
        createMessage.success('删除wiki空间失败' + err.message);
      });
  };

  const handleAdd = () => {
    openModal(true, {
      isUpdate: false,
    });
  };

  const handleSuccess = ({ isUpdate, values }) => {
    if (isUpdate) {
      createMessage.success('更新wiki空间成功');
    } else {
      createMessage.success('新增wiki空间成功');
    }
    fetch();
  };

  const handleZoneClick = (record) => {
    console.log('zone click');
    const { href } = router.resolve({
      path: '/wiki/category-page',
      query: {
        zone_id: record.id,
      },
    });
    window.open(href, '_blank');
  };

  onMounted(() => {
    fetch();
  });
</script>
<style lang="less" scoped></style>
