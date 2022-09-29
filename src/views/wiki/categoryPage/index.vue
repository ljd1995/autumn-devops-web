<template>
  <PageWrapper dense contentFullHeight contentClass="flex" v-loading="loadingRef">
    <CategoryTree class="w-3/8 xl:w-1/5 sm:w-1/3" @select="handleSelect" :zone-id="query.zone_id" />
    <Card class="w-5/8 xl:w-4/5 sm:w-2/3" :title="state.title">
      <template #extra>
        <Row v-show="state.title" class="-mb-4" :gutter="10"
          ><Col :span="4"
            ><Popover title="页面分享" trigger="click" class="mr-4">
              <template #content>
                <Input v-model:value="sharePage.link" readonly>
                  <template #prefix>
                    <span class="text-yellow-500">链接</span>
                  </template>
                </Input>
                <br />
                <Input v-model:value="sharePage.password" class="mt-3 mb-3" readonly>
                  <template #prefix>
                    <span class="text-yellow-500">密码</span>
                  </template>
                </Input>
                <a-button class="w-full" type="primary" @click="handleShareCopy"
                  >复制分享信息</a-button
                >
              </template>
              <a-button
                preIcon="ant-design:share-alt-outlined"
                type="dashed"
                color="warning"
                @click="handleShare"
                >分享</a-button
              >
            </Popover></Col
          ><Col :span="4">
            <a-button
              preIcon="clarity:note-edit-line"
              type="dashed"
              @click="handleEdit"
              color="success"
              >编辑</a-button
            ></Col
          ><Col :span="16"
            ><div class="text-xs text-right font-thin">
              <p
                >由 <span class="text-yellow-500 font-medium">{{ state.create_user }}</span> 于<span
                  class="text-green-500 font-medium"
                  >{{ state.create_time }}</span
                >创建</p
              >
              <p class="-mt-2"
                >最近一次修改于<span class="text-green-500 font-medium">{{
                  state.update_time
                }}</span
                >，由
                <span class="text-yellow-500 font-medium">{{ state.update_user }}</span> 更新</p
              >
            </div></Col
          ></Row
        >
      </template>
      <Empty v-show="state.title === ''" />
      <md-editor
        v-model="state.content"
        :editorId="state.id"
        :preview-theme="state.previewTheme"
        previewOnly /></Card
  ></PageWrapper>
</template>
<script lang="ts" setup name="CategoryPage">
  import { PageWrapper } from '/@/components/Page';
  import CategoryTree from './CategoryTree.vue';
  import { getWikiPageInfo, updateWikiPage } from '/@/api/wiki/wikiPage';
  import { reactive, ref } from 'vue';
  import { Card, Empty, Row, Col, Popover, Input } from 'ant-design-vue';
  import MdEditor from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { useRoute, useRouter } from 'vue-router';
  import { useClipboard } from '@vueuse/core';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { AesEncryption } from '/@/utils/cipher';
  import { AesEnum } from '/@/enums/cipherEnum';

  const route = useRoute();
  const query = route.query;

  const state = reactive({
    content: '',
    id: 'my-editor',
    previewTheme: 'smart-blue',
    title: '',
    page_id: 1,
    create_user: '',
    update_user: '',
    create_time: '',
    update_time: '',
    remark: '',
    wiki_category_id: 0,
  });

  const loadingRef = ref(false);
  const router = useRouter();

  const sharePage = reactive({
    link: '',
    password: '',
  });

  const { isSupported, copy } = useClipboard();
  const { createMessage } = useMessage();
  const aes = new AesEncryption({ key: AesEnum.KEY, iv: AesEnum.IV });

  const handleSelect = async (value) => {
    if (value && String(value).startsWith('page')) {
      const values = value.split('-');
      loadingRef.value = true;
      getWikiPageInfo(values[1])
        .then(async (resp) => {
          console.log(resp);
          state.page_id = resp.id;
          state.title = resp.name;
          state.content = resp.content;
          state.remark = resp.remark;
          state.wiki_category_id = resp.wiki_category_id;
          state.create_user = resp.create_user;
          state.update_user = resp.update_user;
          state.create_time = resp.create_time;
          state.update_time = resp.update_time;
          sharePage.password = aes.decryptByAES(resp.secret);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          loadingRef.value = false;
        });
    }
  };

  // 随机生成六位数
  const getRandomSixNum = () => {
    let RandomSixStr = '';
    for (let i = 0; i < 6; i++) {
      RandomSixStr += String(Math.floor(Math.random() * 10));
    }
    return RandomSixStr;
  };

  const handleShare = () => {
    const baseUrl = window.location.host;
    sharePage.link = `http://${baseUrl}/#/wiki/share-page?id=${state.page_id}`;
    if (!sharePage.password) {
      loadingRef.value = true;
      sharePage.password = getRandomSixNum();
      updateWikiPage(state.page_id, {
        name: state.title,
        content: state.content,
        secret: aes.encryptByAES(sharePage.password),
        remark: state.remark,
        wiki_category_id: state.wiki_category_id,
      })
        .then(() => {
          createMessage.success('分享成功');
        })
        .catch((err) => {
          createMessage.error('分享失败' + err.message);
        })
        .finally(() => {
          loadingRef.value = false;
        });
    } else {
      createMessage.success('分享成功');
    }
  };

  const handleEdit = () => {
    const { href } = router.resolve({
      path: '/wiki/page',
      query: {
        id: state.page_id,
      },
    });
    window.open(href, '_self');
  };

  const handleShareCopy = () => {
    const text = `
${state.title}
链接：${sharePage.link}
密码：${sharePage.password}
`;
    console.log(text);
    if (isSupported) {
      copy(text);
      createMessage.success('已复制');
    } else {
      createMessage.warning('Your browser does not support Clipboard API');
    }
  };
</script>
