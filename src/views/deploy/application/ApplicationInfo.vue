<template>
  <PageWrapper
    class="high-form"
    content="这是应用信息页面，应用和资源的关系为【应用--多环境分组、分服务分组--资源(由CMDB提供)】，请选择性关联"
    v-loading="loadingRef"
  >
    <Card title="基本信息">
      <BasicForm @register="register" />
    </Card>
    <Card title="环境分组信息" class="!mt-5">
      <template #extra>
        <a-button class="ml-2" preIcon="carbon:add-filled" @click="handleAddEnv"
          >新增</a-button
        ></template
      >
      <BasicTable @register="registerTable"
        ><template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  icon: 'clarity:note-edit-line',
                  tooltip: '编辑环境组信息',
                  onClick: handleEdit.bind(null, record),
                },
                {
                  icon: 'ant-design:delete-outlined',
                  color: 'error',
                  tooltip: '删除此环境组',
                  popConfirm: {
                    title: '是否确认删除',
                    placement: 'left',
                    confirm: handleDelete.bind(null, record, index),
                  },
                },
              ]"
            />
          </template> </template
      ></BasicTable>
    </Card>
    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> 提交 </a-button>
    </template>
    <ApplicationDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="ApplicationInfo">
  import { PageWrapper } from '/@/components/Page';
  import { Card } from 'ant-design-vue';
  import { applicationFormSchema, envGroupColumns } from './application.data';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useRoute } from 'vue-router';
  import { onMounted, ref, unref } from 'vue';
  import {
    createApplication,
    getApplicationInfo,
    updateApplication,
  } from '/@/api/deploy/application';
  import ApplicationDrawer from './ApplicationDrawer.vue';
  import { EnvGroupBaseModel } from '/@/api/deploy/model/envGroupModel';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getEnvironmentInfo } from '/@/api/deploy/environment';
  import { getDbInfo } from '/@/api/cmdb/db';
  import { getConfigCenterInfo } from '/@/api/cmdb/configCenter';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDrawer } from '/@/components/Drawer';
  import { deleteEnvGroup } from '/@/api/deploy/envGroup';
  import { useTabs } from '/@/hooks/web/useTabs';

  const route = useRoute();
  const query = route.query;
  const isUpdated = ref(false);
  const loadingRef = ref(false);

  const { refreshPage, setTitle } = useTabs();

  if (query.id) {
    isUpdated.value = true;
    setTitle('编辑应用');
  } else {
    setTitle('新增应用');
  }

  const envGroupList = ref<EnvGroupBaseModel[]>([]);
  const [registerDrawer, { openDrawer }] = useDrawer();

  const { createMessage } = useMessage();

  const [register, { validate, setFieldsValue }] = useForm({
    baseColProps: {
      span: 16,
    },
    schemas: applicationFormSchema,
    showActionButtonGroup: false,
  });

  const [registerTable, { updateTableDataRecord }] = useTable({
    dataSource: envGroupList,
    rowKey: 'id',
    columns: envGroupColumns,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    bordered: true,
    striped: true,
    pagination: false,
    handleSearchInfoFn(info) {
      console.log('handleSearchInfoFn', info);
      return info;
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const handleAddEnv = () => {
    openDrawer(true, { isUpdate: false });
  };

  const handleSuccess = async ({ isUpdate, values }) => {
    const envData = await getEnvironmentInfo(values.environment_id);
    const dbData = await getDbInfo(values.db_id);
    const configData = await getConfigCenterInfo(values.config_center_id);
    values['environment'] = envData;
    values['db'] = dbData;
    values['config_center'] = configData;
    values['hosts'] = values.hosts;
    if (!isUpdate) {
      envGroupList.value.push(values);
    } else {
      updateTableDataRecord(values.id, values);
    }
  };

  const handleEdit = (record) => {
    openDrawer(true, { record, isUpdate: true });
  };

  const handleDelete = (record, index) => {
    if (record.id) {
      deleteEnvGroup(record.id)
        .then(() => {
          createMessage.success('删除环境组成功');
          envGroupList.value.splice(index, 1);
        })
        .catch((err) => {
          createMessage.success('删除环境组失败' + err.message);
        });
    } else {
      envGroupList.value.splice(index, 1);
    }
  };

  const submitAll = async () => {
    try {
      const values = await validate();
      loadingRef.value = true;
      if (!unref(isUpdated)) {
        createApplication({ ...values })
          .then(() => {
            createMessage.success('新增应用成功');
          })
          .catch(() => {})
          .finally(() => {
            loadingRef.value = false;
          });
      } else {
        await updateApplication(query.id, { ...values, application_groups: envGroupList.value });
        createMessage.success('更新应用成功');
        refreshPage();
      }
    } catch (e) {
      console.log(e);
    } finally {
      loadingRef.value = false;
    }
  };

  const fetch = () => {
    loadingRef.value = true;
    getApplicationInfo(query.id)
      .then((resp) => {
        setFieldsValue({
          ...resp,
        });
        envGroupList.value = resp.application_groups as unknown[] as EnvGroupBaseModel[];
      })
      .catch((error) => {
        console.log('error:', error);
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  onMounted(() => {
    if (isUpdated.value) {
      fetch();
    }
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
