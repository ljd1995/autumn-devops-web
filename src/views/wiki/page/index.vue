<template>
  <PageWrapper dense contentFullHeight class="content" v-loading="loadingRef">
    <md-editor
      v-model="state.content"
      :editorId="state.id"
      :preview-theme="state.previewTheme"
      :toolbarsExclude="state.toolbarsExclude"
      :placeholder="state.placeholder"
      :footers="footers"
      @save="handleEditorSave"
      @upload-img="handleUploadImg"
      pageFullScreen
      ><template #defFooters>
        <span>{{ state.title }}</span>
        <span
          >由<span class="text-green-400">{{ state.create_user }}</span
          >创建,最后由<span class="text-blue-400">{{ state.update_user }}</span
          >更新</span
        >
      </template></md-editor
    >
  </PageWrapper>
</template>
<script lang="ts" setup name="WikiPage">
  import { onMounted, reactive, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import MdEditor from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { useRoute } from 'vue-router';
  import { getWikiPageInfo, updateWikiPage, WikiPageUploadFile } from '/@/api/wiki/wikiPage';
  import { useMessage } from '/@/hooks/web/useMessage';

  const route = useRoute();
  const query = route.query;

  const loadingRef = ref(false);

  const footers = ['markdownTotal', 0, '=', 1, 'scrollSwitch'];

  const { createMessage } = useMessage();

  const state = reactive({
    content: '',
    id: 'page-editor',
    title: '',
    create_user: '',
    update_user: '',
    secret: '',
    remark: '',
    wiki_category_id: 0,
    previewTheme: 'smart-blue',
    placeholder: '## 请尽情使用markdown编写吧... ##支持常用快捷键  ## 支持粘贴图片',
    toolbarsExclude: ['github'],
  });

  const saveWikiContent = (val: string) => {
    loadingRef.value = true;
    updateWikiPage(query.id, {
      name: state.title,
      content: val,
      secret: state.secret,
      remark: state.remark,
      wiki_category_id: state.wiki_category_id,
    })
      .then(() => {
        createMessage.success('保存成功');
      })
      .catch((err) => {
        createMessage.error('保存失败' + err.message);
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  const handleEditorSave = (val: string) => {
    saveWikiContent(val);
  };

  const handleUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map((file) => {
        console.log(file);
        return new Promise((rev, rej) => {
          WikiPageUploadFile({ file: file })
            .then((res) => rev(res.data.result))
            .catch((error) => rej(error));
        });
      }),
    );

    callback(
      res.map((item) => {
        console.log(item);
        return item;
      }),
    );
  };

  const fetch = () => {
    loadingRef.value = true;
    getWikiPageInfo(query.id)
      .then(async (resp) => {
        console.log(resp);
        state.content = resp.content;
        state.title = resp.name;
        state.create_user = resp.create_user;
        state.update_user = resp.update_user;
        state.secret = resp.secret;
        state.remark = resp.remark;
        state.wiki_category_id = resp.wiki_category_id;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  onMounted(() => {
    fetch();
    setTimeout(() => {
      saveWikiContent(state.content);
    }, 60000);
  });
</script>
<style lang="less" scoped>
  .content {
    width: 100%;
    height: 100vh;
  }
</style>
