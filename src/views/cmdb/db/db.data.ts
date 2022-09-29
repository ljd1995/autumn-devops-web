import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Checkbox, Tag } from 'ant-design-vue';
import { ColumnsType } from 'ant-design-vue/lib/table';

export const columns: BasicColumn[] = [
  {
    title: '地址',
    dataIndex: 'address',
    width: 120,
  },
  {
    title: '端口',
    dataIndex: 'port',
    width: 60,
  },
  {
    title: '类型',
    dataIndex: 'db_type',
    width: 70,
  },
  {
    title: '来源',
    dataIndex: 'source',
    width: 80,
    customRender: ({ record }) => {
      const source = record.source;
      let color = '';
      let text = '';
      if (source === 'host') {
        color = 'green';
        text = '服务器';
      } else if (source === 'cloud') {
        color = 'blue';
        text = '云厂商';
      }
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '版本',
    dataIndex: 'db_version',
    width: 120,
  },
  {
    title: '数据库名称',
    dataIndex: 'db_name',
    width: 160,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 130,
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
    field: 'db_type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'MySQL', value: 'mysql' },
        { label: 'Postgresql', value: 'pg' },
        { label: 'MariaDB', value: 'maria' },
        { label: 'MongoDB', value: 'mongo' },
        { label: 'Redis', value: 'redis' },
        { label: 'ElasticSearch', value: 'elastic' },
        { label: 'HBase', value: 'hbase' },
      ],
    },
    colProps: { span: 5 },
  },
  {
    field: 'source',
    label: '来源',
    component: 'Select',
    componentProps: {
      options: [
        { label: '服务器', value: 'host' },
        { label: '云厂商', value: 'cloud' },
      ],
    },
    colProps: { span: 5 },
  },
];

export const dbFormSchema: FormSchema[] = [
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
    field: 'db_type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'MySQL', value: 'mysql' },
        { label: 'Postgresql', value: 'pg' },
        { label: 'MariaDB', value: 'maria' },
        { label: 'MongoDB', value: 'mongo' },
        { label: 'Redis', value: 'redis' },
        { label: 'ElasticSearch', value: 'elastic' },
        { label: 'HBase', value: 'hbase' },
      ],
    },
    required: true,
  },
  {
    field: 'source',
    label: '来源',
    component: 'Select',
    componentProps: {
      options: [
        { label: '服务器', value: 'host' },
        { label: '云厂商', value: 'cloud' },
      ],
    },
    required: true,
  },
  {
    field: 'db_version',
    label: '版本',
    component: 'Input',
    required: false,
  },
  {
    label: '数据库名称',
    field: 'db_name',
    component: 'Input',
    required: false,
  },
  {
    label: '管理员用户名',
    field: 'admin_user',
    component: 'Input',
    required: false,
  },
  {
    label: '管理员密码',
    field: 'admin_password',
    component: 'InputPassword',
    required: false,
  },
  {
    label: '查询用户名',
    field: 'query_user',
    component: 'Input',
    required: false,
  },
  {
    label: '查询用户密码',
    field: 'query_password',
    component: 'InputPassword',
    required: false,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    required: true,
  },
];

export const dbColumns: ColumnsType<any> = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '类型与长度',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
  },
  {
    title: '默认值',
    dataIndex: 'default',
    key: 'default',
    align: 'center',
    customRender: ({ record }) => {
      let text = record.default;
      if (record.type === '') {
        text = 'EMPTY STRING';
      }
      return text;
    },
  },
  {
    title: '不是null',
    dataIndex: 'nullable',
    key: 'nullable',
    align: 'center',
    customRender: ({ record }) => {
      return h(Checkbox, { checked: !record.nullable });
    },
  },
  {
    title: '是否自增',
    dataIndex: 'autoincrement',
    key: 'autoincrement',
    align: 'center',
    customRender: ({ record }) => {
      return h(Checkbox, { checked: record.autoincrement });
    },
  },
  {
    title: '备注',
    dataIndex: 'comment',
    key: 'comment',
    align: 'center',
  },
];

export const tableColumns: ColumnsType<any> = [
  {
    title: '名称',
    dataIndex: 'table_name',
    key: 'table_name',
    align: 'center',
  },
  {
    title: '引擎',
    dataIndex: 'table_engine',
    key: 'table_engine',
    align: 'center',
  },
  {
    title: '排序规则',
    dataIndex: 'table_default_charset',
    key: 'table_default_charset',
    align: 'center',
  },
  {
    title: '注释',
    dataIndex: 'table_comment',
    key: 'table_comment',
    align: 'center',
  },
];
