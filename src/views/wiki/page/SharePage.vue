<template>
  <PageWrapper dense contentFullHeight class="content" v-loading="loadingRef">
    <div class="ml-30 mr-90 mt-10 mb-6" v-if="pageShow">
      <p class="font-bold text-center text-2xl">{{ state.title }}</p>
      <Row>
        <Col :span="4">
          <md-catalog :editorId="state.id" :scroll-element="scrollElement" :theme="state.theme"
        /></Col>
        <Col :span="20">
          <md-editor
            v-model="state.content"
            :editorId="state.id"
            :preview-theme="state.previewTheme"
            previewOnly
        /></Col>
      </Row>
    </div>
    <div v-else class="form">
      <div class="form-container">
        <BasicForm @register="registerForm" @submit="handleSubmit">
          <template #customSlot="{ model, field }">
            <InputPassword
              v-model:value="model[field]"
              style="width: 200px"
              placeholder="请输入页面分享密码"
            />
          </template>
        </BasicForm>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup name="WikiSharePage">
  import { onMounted, reactive, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Row, Col, InputPassword } from 'ant-design-vue';
  import MdEditor from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { getWikiPageInfo } from '/@/api/wiki/wikiPage';
  import { useRoute } from 'vue-router';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { AesEncryption } from '/@/utils/cipher';
  import { AesEnum } from '/@/enums/cipherEnum';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { createLocalStorage } from '/@/utils/cache';
  import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';

  const formSchema: FormSchema[] = [
    {
      field: 'secret',
      label: '密码',
      component: 'Input',
      required: true,
      slot: 'customSlot',
    },
  ];

  const [registerForm, { validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: true,
    autoSubmitOnEnter: true,
    actionColOptions: {
      span: 19,
    },
    submitButtonOptions: { text: '确认' },
  });

  const MdCatalog = MdEditor.MdCatalog;
  const scrollElement = document.documentElement;

  const aes = new AesEncryption({ key: AesEnum.KEY, iv: AesEnum.IV });

  const { createMessage } = useMessage();

  const pageShow = ref(false);
  const loadingRef = ref(false);
  const route = useRoute();
  const query = route.query;

  const ls = createLocalStorage();

  const state = reactive({
    content: '',
    id: 'my-editor',
    previewTheme: 'smart-blue',
    theme: 'light',
    title: '',
    secret: '',
  });

  const fetch = () => {
    loadingRef.value = true;
    getWikiPageInfo(query.id)
      .then(async (resp) => {
        state.content = resp.content;
        state.title = resp.name;
        state.secret = resp.secret;
        const secret = ls.get(`PAGE_SECRET_${query.id}`);
        if (state.secret === secret) {
          pageShow.value = true;
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  const handleSubmit = async () => {
    try {
      const values = await validate();
      if (aes.decryptByAES(state.secret) === values.secret) {
        pageShow.value = true;
        ls.set(`PAGE_SECRET_${query.id}`, state.secret, DEFAULT_CACHE_TIME);
      } else {
        createMessage.warning('分享密码不正确，请重新输入');
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  onMounted(() => {
    fetch();
  });
</script>
<style lang="less" scoped>
  .form {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
  }

  .form-container {
    width: 340px;
    height: 260px;
    border: 1px dashed rgb(185, 178, 178);
    border-radius: 2px;
    display: flex;
    justify-content: left;
    align-items: center;
    text-align: left;
  }
</style>
