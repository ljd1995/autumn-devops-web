import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '端口',
    dataIndex: 'port',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '版本',
    dataIndex: 'version',
  },
  {
    title: '用户名',
    dataIndex: 'username',
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
    componentProps: {
      placeholder: '输入关键字全局搜索',
    },
    colProps: { span: 8 },
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'NACOS', value: 'nacos' },
        { label: 'POLARIS', value: 'polaris' },
      ],
    },
    colProps: { span: 5 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'address',
    label: '地址',
    component: 'Input',
    required: true,
  },
  {
    field: 'port',
    label: '端口',
    component: 'Input',
    required: true,
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'NACOS', value: 'nacos' },
        { label: 'POLARIS', value: 'polaris' },
      ],
    },
    required: true,
  },
  {
    field: 'version',
    label: '版本',
    component: 'Input',
    required: false,
  },
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    required: true,
  },
  {
    label: '密码',
    field: 'password',
    component: 'InputPassword',
    required: true,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    required: true,
  },
];
