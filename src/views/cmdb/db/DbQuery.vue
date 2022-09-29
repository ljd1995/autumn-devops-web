<template>
  <PageWrapper v-loading="loadingRef">
    <div class="pl-4 pt-1 pr-4">
      <Select
        ref="connSelect"
        v-model:value="connName"
        class="w-50"
        style="margin-right: 20px"
        show-search
        placeholder="请选择连接"
        :options="connOptions"
        @change="handleConnChange"
      />
      <Select
        ref="schemaSelect"
        v-model:value="schemaName"
        show-search
        placeholder="请选择数据库"
        class="w-50"
        :options="schemaOptions"
      />
      <a-button color="success" preIcon="codicon:run-all" class="ml-5" @click="handleSqlQuery"
        >运行</a-button
      >
      <a-button color="primary" preIcon="codicon:run-below" class="ml-5" @click="handleTextQuery"
        >运行已选择的</a-button
      >
    </div>
    <Divider />
    <CodeEditor
      class="pl-2 h-30"
      v-model:value="sql"
      :lineNumbers="false"
      @mouseup="handleMouseSelect"
    />
    <Divider />
    <DbQueryInfo ref="queryInfoRef" />
  </PageWrapper>
</template>
<script lang="ts" setup name="DbQuery">
  import { Select, Divider, SelectProps } from 'ant-design-vue';
  import { ref, onMounted, unref, nextTick } from 'vue';
  import { getDbPageList, getSchemaNames } from '/@/api/cmdb/db';
  import { CodeEditor } from '/@/components/CodeEditor';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import DbQueryInfo from './DbQueryInfo.vue';
  import { AesEncryption } from '/@/utils/cipher';
  import { AesEnum } from '/@/enums/cipherEnum';

  const sql = ref('请输入SQL');
  const dbList = ref<Recordable>([]);
  const connOptions = ref<SelectProps['options']>([]);
  const schemaOptions = ref<SelectProps['options']>([]);
  const connName = ref(0);
  const schemaName = ref('');
  const loadingRef = ref(false);
  const queryInfoRef = ref<InstanceType<typeof DbQueryInfo>>();
  const selectText = ref('');

  const aes = new AesEncryption({ key: AesEnum.KEY, iv: AesEnum.IV });

  const handleMouseSelect = () => {
    nextTick(() => {
      selectText.value = window.getSelection()?.toString() as unknown as string;
      console.log(selectText.value);
      if (selectText.value) {
        createMessage.info('获取到选中值为：' + selectText.value);
      }
    });
  };

  const { createMessage } = useMessage();

  const getSchemaOptions = (item) => {
    loadingRef.value = true;
    getSchemaNames({
      username: item.admin_user,
      password: item.admin_password,
      host: item.address,
      port: item.port,
      db_type: item.db_type,
    })
      .then((data) => {
        console.log(data);
        schemaOptions.value = data.map((item) => {
          return { label: item, value: item };
        }) as unknown[] as SelectProps['options'];
        schemaName.value = unref(schemaOptions)?.[0]?.value as string;
      })
      .catch((e) => {
        console.log(e);
        createMessage.error(
          '获取数据库信息失败，请检查数据库用户名密码是否正确，数据库是否开放连接权限',
        );
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  const getConnOptions = () => {
    loadingRef.value = true;
    getDbPageList({ page: 1, page_size: 500 })
      .then((data) => {
        dbList.value = data.items.map((item) => {
          return {
            ...item,
            admin_password: aes.decryptByAES(item.admin_password),
            query_password: aes.decryptByAES(item.query_password),
          };
        });
        connOptions.value = data.items.map((item, index) => {
          return { label: item.remark, value: index };
        }) as unknown[] as SelectProps['options'];
        connName.value = 0;
        getSchemaOptions(dbList.value[0]);
      })
      .catch((e) => {
        console.log(e);
        createMessage.error(e);
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  const handleConnChange = (val) => {
    getSchemaOptions(dbList.value[val]);
  };

  const handleSqlQuery = () => {
    let item = unref(dbList)[unref(connName)];
    queryInfoRef.value?.handleSqlQuery(item, schemaName.value, sql.value);
  };

  const handleTextQuery = () => {
    if (!selectText.value) {
      createMessage.warning('选择的SQL为空');
      return;
    }
    let item = unref(dbList)[unref(connName)];
    queryInfoRef.value?.handleSqlQuery(item, schemaName.value, selectText.value);
  };

  onMounted(() => {
    getConnOptions();
  });
</script>
