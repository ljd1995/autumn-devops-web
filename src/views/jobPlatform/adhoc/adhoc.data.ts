import { getHostGroupData } from '/@/api/cmdb/hostGroup';
import { getUserPageList } from '/@/api/system/user';
import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';

export const adhocFormSchema: FormSchema[] = [
  {
    field: 'host_group_id',
    label: '主机组',
    component: 'ApiTreeSelect',
    componentProps: {
      api: getHostGroupData,
      resultField: 'items',
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'module',
    label: '模块',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'shell', value: 'shell' },
        { label: 'ping', value: 'ping' },
        { label: 'script', value: 'script' },
        { label: 'setup', value: 'setup' },
        { label: 'copy', value: 'copy' },
        { label: 'fetch', value: 'fetch' },
        { label: 'file', value: 'file' },
        { label: 'service', value: 'service' },
        { label: 'unarchive', value: 'unarchive' },
        { label: 'archive', value: 'archive' },
        { label: 'cron', value: 'cron' },
        { label: 'hostname', value: 'hostname' },
        { label: 'yum', value: 'yum' },
        { label: 'apt', value: 'apt' },
        { label: 'user', value: 'user' },
        { label: 'group', value: 'group' },
      ],
    },
    defaultValue: 'shell',
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'host_pattern',
    label: '限制',
    component: 'Input',
    required: false,
    componentProps: {
      placeholder: '请输入通配符*或IP',
    },
    colProps: { span: 12 },
  },
  {
    field: 'fork',
    label: '并发',
    component: 'InputNumber',
    required: false,
    defaultValue: 10,
    colProps: { span: 12 },
  },
  {
    field: 'module_args',
    label: '参数',
    component: 'InputTextArea',
    required: false,
    componentProps: {
      autoSize: { minRows: 4, maxRows: 7 },
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '主机组',
    dataIndex: 'host_group',
    customRender: ({ record }) => {
      return record.host_group.name;
    },
  },
  {
    title: '限制',
    dataIndex: 'host_pattern',
  },
  {
    title: '模块',
    dataIndex: 'module',
  },
  {
    title: '模块参数',
    dataIndex: 'module_args',
  },
  {
    title: '并发',
    dataIndex: 'fork',
  },
  {
    title: '执行人',
    dataIndex: 'username',
  },
  {
    title: '执行时间',
    dataIndex: 'create_time',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'search',
    label: '搜索',
    component: 'Input',
    componentProps: {
      placeholder: '输入关键字全局搜索',
    },
    colProps: { span: 8 },
  },
  {
    field: 'username',
    label: '用户名',
    component: 'ApiSelect',
    componentProps: {
      api: getUserPageList,
      params: {
        page: 1,
        page_size: 300,
      },
      resultField: 'items',
      labelField: 'username',
      valueField: 'username',
    },
    colProps: { span: 5 },
  },
];
