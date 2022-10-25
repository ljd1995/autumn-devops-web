import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { getConfigCenterPageList } from '/@/api/cmdb/configCenter';
import { getDbPageList } from '/@/api/cmdb/db';
import { getDeployConfigPageList } from '/@/api/cmdb/deployConfig';
import { getEnvironmentPageList } from '/@/api/deploy/environment';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: 'git地址',
    dataIndex: 'git_url',
  },
  {
    title: '开发语言',
    dataIndex: 'language',
    width: 90,
  },
  {
    title: '开发语言版本',
    dataIndex: 'language_version',
    width: 110,
  },
  {
    title: '启动端口',
    dataIndex: 'port',
    width: 90,
  },
  {
    title: '负责人',
    dataIndex: 'principal',
    width: 120,
  },
  {
    title: '创建用户',
    dataIndex: 'create_user',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'search',
    label: '搜索',
    component: 'Input',
    colProps: { span: 10 },
    componentProps: {
      placeholder: '输入关键字全局搜索',
    },
  },
];

export const applicationFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    required: true,
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'module_name',
    label: '模块名称',
    required: true,
    component: 'Input',
    colProps: { span: 5, offset: 1 },
  },
  {
    field: 'service_name',
    label: '服务名称',
    required: true,
    component: 'Input',
    colProps: { span: 5, offset: 1 },
  },
  {
    field: 'principal',
    label: '负责人',
    required: true,
    component: 'Input',
    colProps: { span: 5, offset: 1 },
  },
  {
    field: 'git_url',
    label: 'git地址',
    required: true,
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'git_config_id',
    label: 'git token',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: getDeployConfigPageList,
      params: {
        page: 1,
        page_size: 300,
        type: 'git',
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
    },
    colProps: { span: 3, offset: 1 },
  },
  {
    field: 'language',
    label: '开发语言',
    required: true,
    component: 'Select',
    defaultValue: 'java',
    componentProps: {
      options: [
        { label: 'python', value: 'python' },
        { label: 'go', value: 'go' },
        { label: 'java', value: 'java' },
        { label: 'c', value: 'c' },
        { label: 'c++', value: 'c++' },
        { label: 'lua', value: 'lua' },
        { label: 'js', value: 'js' },
        { label: 'ts', value: 'ts' },
        { label: 'c#', value: 'c#' },
        { label: 'php', value: 'php' },
      ],
    },
    colProps: { span: 3, offset: 1 },
  },
  {
    field: 'language_version',
    label: '开发语言版本',
    required: true,
    component: 'Input',
    colProps: { span: 3, offset: 1 },
  },
  {
    field: 'port',
    label: '启动端口',
    required: true,
    component: 'Input',
    colProps: { span: 3, offset: 1 },
  },
  {
    field: 'dockerfile_url',
    label: 'dockerfile地址',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'helm_chart_url',
    label: 'helm chart地址',
    required: true,
    component: 'Input',
    colProps: { span: 11, offset: 1 },
  },
  {
    field: 'parameters',
    label: '启动参数',
    required: false,
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
];

export const envGroupFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'branch_name',
    label: '分支名称',
    required: true,
    component: 'Input',
    colProps: { span: 11, offset: 1 },
  },
  {
    field: 'k8s_config_id',
    label: 'k8s集群',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: getDeployConfigPageList,
      params: {
        page: 1,
        page_size: 100,
        type: 'k8s',
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
    },
    colProps: { span: 11, offset: 1 },
  },
  {
    field: 'registry_config_id',
    label: '镜像仓库',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: getDeployConfigPageList,
      params: {
        page: 1,
        page_size: 100,
        type: 'docker_registry',
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
    },
    colProps: { span: 11, offset: 1 },
  },
  {
    field: 'config_center_ns',
    label: '配置中心命名空间',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    field: 'k8s_ns',
    label: 'K8s集群命名空间',
    required: true,
    component: 'Input',
    colProps: { span: 11, offset: 1 },
  },
  {
    field: 'environment_id',
    label: '环境',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: getEnvironmentPageList,
      params: {
        page: 1,
        page_size: 300,
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'db_id',
    label: '数据库',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: getDbPageList,
      params: {
        page: 1,
        page_size: 300,
      },
      resultField: 'items',
      labelField: 'remark',
      valueField: 'id',
    },
  },
  {
    field: 'config_center_id',
    label: '配置中心',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: getConfigCenterPageList,
      params: {
        page: 1,
        page_size: 300,
      },
      resultField: 'items',
      labelField: 'remark',
      valueField: 'id',
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

export const envGroupColumns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '分支名称',
    dataIndex: 'branch_name',
  },
  {
    title: '配置中心命名空间',
    dataIndex: 'config_center_ns',
  },
  {
    title: 'K8s集群命名空间',
    dataIndex: 'k8s_ns',
  },
  {
    title: '环境',
    dataIndex: 'environment_id',
    customRender: ({ record }) => {
      return h(Tag, { color: 'red' }, () => record.environment.name);
    },
  },
  {
    title: '数据库',
    dataIndex: 'db_name_id',
    customRender: ({ record }) => {
      return h(Tag, { color: 'blue' }, () => record.db.remark);
    },
  },
  {
    title: '配置中心',
    dataIndex: 'config_center_id',
    customRender: ({ record }) => {
      return h(Tag, { color: 'green' }, () => record.config_center.remark);
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '主机资源',
    dataIndex: 'hosts',
    ifShow: false,
  },
  {
    title: 'k8s集群',
    dataIndex: 'k8s_config_id',
    ifShow: false,
  },
  {
    title: '镜像仓库',
    dataIndex: 'registry_config_id',
    ifShow: false,
  },
];
