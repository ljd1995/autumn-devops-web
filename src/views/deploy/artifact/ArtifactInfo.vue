<template>
  <PageWrapper
    class="high-form"
    content="这是制品详情页面，你可以自由组合Pipeline要使用的插件，定制适合该制品的CICD流程，制品与应用的关系是：制品--应用--统一CICD流程--多环境参数构建"
    v-loading="loadingRef"
  >
    <Card title="基本信息">
      <BasicForm @register="register" />
    </Card>
    <Card title="Pipeline" class="!mt-5">
      <template #extra>
        <Popover trigger="click" placement="bottomRight">
          <template #content> </template>
          <a-button class="ml-2" preIcon="tabler:template">Pipeline模板</a-button>
        </Popover>
        <a-button class="ml-2" preIcon="carbon:add-filled" @click="handleAdd">新增</a-button>
      </template>
      <BasicTable @register="registerTable"
        ><template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'action'">
            <TableAction
              class="float-left"
              :actions="[
                {
                  icon: 'flat-color-icons:view-details',
                  tooltip: '自定义插件参数',
                  onClick: handlePluginDetail.bind(null, record, index),
                },
                {
                  icon: 'clarity:note-edit-line',
                  tooltip: '编辑与添加插件',
                  onClick: handleEdit.bind(null, record, index),
                },
                {
                  icon: 'ant-design:delete-outlined',
                  color: 'error',
                  tooltip: '删除',
                  popConfirm: {
                    title: '是否确认删除',
                    placement: 'left',
                    confirm: handleDelete.bind(null, record, index),
                  },
                },
              ]"
            />
            <Popover trigger="click" placement="bottomRight">
              <template #content>
                <draggable
                  tag="ul"
                  :list="record.plugins"
                  class="list-group"
                  handle=".text"
                  item-key="id"
                >
                  <template #item="{ element, index }">
                    <li class="list-group-item pt-2">
                      <Tag>{{ index + 1 }}</Tag>
                      <Icon icon="fe:text-align-justify" class="handle mr-2" />

                      <span class="text">{{ element.name }} </span>
                      <Popconfirm
                        placement="rightBottom"
                        title="你确定删除该插件吗?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="removeAt(record.plugins, index)"
                      >
                        <Icon icon="ci:close-small" class="ml-1 close" />
                      </Popconfirm>
                      <hr />
                    </li>
                  </template>
                </draggable>
              </template>
              <Tooltip placement="bottom">
                <template #title>插件排序</template>
                <Icon
                  icon="fluent:arrow-sort-down-lines-16-filled"
                  color="green"
                  class="-ml-5 mt-1"
                />
              </Tooltip>
            </Popover>
          </template> </template
      ></BasicTable>
    </Card>
    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> 提交 </a-button>
    </template>
    <CICDPluginDrawer @register="registerDrawer" @check="handlePluginCheck" />
    <PluginDetailDrawer @register="registerDetailDrawer" @submit="handleDetailSubmit" />
  </PageWrapper>
</template>
<script lang="ts" setup name="ArtifactInfo">
  // //@ts-nocheck
  import { PageWrapper } from '/@/components/Page';
  import { Card, Popover, Tag, Popconfirm, Tooltip } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useRoute } from 'vue-router';
  import { getArtifactInfo, updateArtifact } from '../../../api/deploy/cicd';
  import { onMounted, ref, unref } from 'vue';
  import CICDPluginDrawer from './CICDPluginDrawer.vue';
  import PluginDetailDrawer from './PluginDetailDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import draggable from 'vuedraggable';
  import Icon from '/@/components/Icon';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { ApplicationListItem } from '/@/api/deploy/model/applicationModel';
  import { getApplicationPageList } from '/@/api/deploy/application';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { EnvGroupListItem } from '/@/api/deploy/model/envGroupModel';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { pipelineColumns } from './artifact.data';
  import { CICDPluginListItem } from '/@/api/deploy/model/cicdModel';

  const route = useRoute();
  const query = route.query;

  const isUpdated = ref(false);
  const loadingRef = ref(false);

  const { refreshPage, setTitle } = useTabs();
  const { createMessage } = useMessage();

  if (query.id) {
    isUpdated.value = true;
    setTitle('编辑制品');
  } else {
    setTitle('新增制品');
  }

  interface pipeline {
    name: string;
    envName: string;
    plugins: CICDPluginListItem[];
  }

  interface option {
    label: string;
    value: number;
  }

  const pipelineList = ref<pipeline[]>([]);
  const applicationData = ref<ApplicationListItem[]>([]);
  const applicationOptions = ref<option[]>([]);
  const currentApplication = ref<ApplicationListItem>();
  const envGroups = ref<EnvGroupListItem[]>([]);

  const artifactFormSchema: FormSchema[] = [
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      required: true,
      colProps: { span: 6 },
    },
    {
      field: 'application_id',
      label: '所属应用',
      required: true,
      component: 'Select',
      componentProps: () => {
        return {
          options: applicationOptions.value,
          onChange: (e) => {
            handleApplicationChange(e);
          },
        };
      },
      colProps: { span: 4, offset: 1 },
    },
    {
      label: '备注',
      field: 'remark',
      component: 'Input',
      colProps: {
        span: 12,
        offset: 1,
      },
    },
  ];

  const [registerTable, { updateTableDataRecord }] = useTable({
    dataSource: pipelineList,
    rowKey: 'id',
    columns: pipelineColumns,
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
      width: 170,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const [register, { validate, setFieldsValue }] = useForm({
    baseColProps: {
      span: 16,
    },
    schemas: artifactFormSchema,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();

  async function submitAll() {
    try {
      const values = await validate();
      console.log('form data:', values);
      if (unref(isUpdated)) {
        const plugins = pipelineList.value.map(item => {
          return {
            name: item.name,
          }
        })

        await updateArtifact(query.id, {
          name: values.name,
          remark: values.remark,
          pipelines: pipelineList.value,
        });
      }
    } catch (error) {}
  }

  const handleAdd = () => {
    if (!unref(currentApplication)) {
      createMessage.warning('请先选择应用，Pipeline需要依赖应用才能新增');
      return;
    }
    openDrawer(true, { isUpdate: false, envGroups: envGroups.value });
  };

  const handlePluginCheck = ({ isUpdate, values, index }) => {
    const envGroup = envGroups.value.filter((item) => item.name === values.envName);
    values.rows.map((item) => {
      item.default_parameters['name'] = item.name;
      if (item.name === '配置修改') {
        item.default_parameters.namespace = envGroup[0].config_center_ns;
        item.default_parameters.config_center_id = envGroup[0].config_center.id;
      }
      if (item.name === 'sql执行') {
        item.default_parameters.db_id = envGroup[0].db.id;
      }
      if (item.name === 'helm安装') {
        item.default_parameters.k8s_config_id = envGroup[0].k8s_config_id;
        item.default_parameters.namespace = envGroup[0].k8s_ns;
        item.default_parameters.module_name = currentApplication.value!.module_name;
        item.default_parameters.service_name = currentApplication.value!.service_name;
      }
      if (item.name === 'docker操作') {
        item.default_parameters.config_id = envGroup[0].registry_config_id;
        item.default_parameters.module_name = currentApplication.value!.module_name;
      }
      if (item.name === 'Git操作') {
        item.default_parameters.config_id = currentApplication.value!.git_config_id;
        item.default_parameters.git_url = currentApplication.value!.git_url;
        item.default_parameters.branch_name = envGroup[0].branch_name;
      }
    });
    console.log(values.rows);
    if (!isUpdate) {
      pipelineList.value = [
        ...pipelineList.value,
        { name: values.name, envName: values.envName, plugins: values.rows },
      ];
    } else {
      pipelineList.value[index].plugins = [...pipelineList.value[index].plugins, ...values.rows];
    }
  };

  const removeAt = (items, idx) => {
    items.splice(idx, 1);
  };

  const handleEdit = (record, index) => {
    if (!unref(currentApplication)) {
      createMessage.warning('请先选择应用，Pipeline需要依赖应用才能编辑');
      return;
    }
    openDrawer(true, { record, index, isUpdate: true, envGroups: envGroups.value });
  };

  const handleDelete = (record, index) => {
    if (record.id) {
      // deleteEnvGroup(record.id)
      //   .then(() => {
      //     createMessage.success('删除环境组成功');
      //     envGroupList.value.splice(index, 1);
      //   })
      //   .catch((err) => {
      //     createMessage.success('删除环境组失败' + err.message);
      //   });
    } else {
      pipelineList.value.splice(index, 1);
    }
  };

  const handlePluginDetail = (record, index) => {
    openDetailDrawer(true, { record, index });
  };

  const handleApplicationChange = (e) => {
    currentApplication.value = applicationData.value.filter((item) => item.id === e)[0];
    envGroups.value = currentApplication.value.application_groups;
  };

  const fetch = () => {
    loadingRef.value = true;
    getArtifactInfo(query.id)
      .then((resp) => {
        setFieldsValue({
          ...resp,
        });
      })
      .catch((error) => {
        console.log('error:', error);
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  const getAppplicationData = () => {
    loadingRef.value = true;
    getApplicationPageList({ page: 1, page_size: 300 })
      .then((resp) => {
        applicationData.value = resp.items;
        applicationOptions.value = resp.items.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      })
      .catch((error) => {
        console.log('error:', error);
      })
      .finally(() => {
        loadingRef.value = false;
      });
  };

  const handleDetailSubmit = ({ plugins, rowIndex }) => {
    pipelineList.value[rowIndex].plugins = plugins;
    console.log(pipelineList);
  };

  onMounted(() => {
    if (isUpdated.value) {
      fetch();
    }
    getAppplicationData();
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }

  .handle {
    margin-right: 2px;
    cursor: pointer;
  }

  .close {
    float: right;
    cursor: pointer;
  }

  .text {
    margin: 0 0px;
  }

  .list-group {
    min-height: 20px;
  }

  .list-group-item {
    cursor: move;
  }
</style>
