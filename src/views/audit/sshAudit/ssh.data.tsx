import { Tag } from 'ant-design-vue';
import { getUserPageList } from '/@/api/system/user';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 100,
  },
  {
    title: '远程主机',
    dataIndex: 'ssh_host',
    width: 150,
  },
  {
    title: 'ssh用户',
    dataIndex: 'ssh_user',
    width: 90,
  },
  {
    title: '代理主机',
    dataIndex: 'proxy_host',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 90,
    customRender: ({ record }) => {
      if (record.status === 0) {
        return <Tag color="green">在线</Tag>;
      } else {
        return <Tag color="red">已断开</Tag>;
      }
    },
  },
  {
    title: 'ssh历史命令',
    dataIndex: 'ssh_command',
  },
  {
    title: '开始时间',
    dataIndex: 'create_time',
    width: 170,
  },
  {
    title: '结束时间',
    dataIndex: 'update_time',
    width: 170,
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
      immediate: false,
    },
    colProps: { span: 5 },
  },
];
