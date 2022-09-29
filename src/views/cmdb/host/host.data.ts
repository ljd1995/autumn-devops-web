import { Tag } from 'ant-design-vue';
import { ColumnsType } from 'ant-design-vue/lib/table';
import { h } from 'vue';
import { DescItem } from '/@/components/Description';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '内网IP',
    dataIndex: 'intranet_ip',
  },
  {
    title: '外网IP',
    dataIndex: 'external_ip',
  },
  {
    title: '类型',
    dataIndex: 'host_type',
    customRender: ({ record }) => {
      const host_type = record.host_type;
      let color = '';
      let text = '';
      if (host_type === 'local') {
        color = 'green';
        text = '本地虚拟机';
      } else if (host_type === 'cloud') {
        color = 'blue';
        text = '云主机';
      } else {
        color = 'yellow';
        text = '物理机';
      }
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '归属',
    dataIndex: 'belongs_to',
    customRender: ({ record }) => {
      const belongs_to = record.belongs_to;
      const belongs = {
        local: '本地机房',
        idc: 'IDC',
        aliyun: '阿里云',
        tencent: '腾讯云',
        baidu: '百度云',
        huawei: '华为云',
        jingdong: '京东云',
        jinshan: '金山云',
        qiniu: '七牛云',
        ucloud: 'UCloud',
        aws: 'AWS',
        azure: 'AZURE',
      };
      return h(Tag, { color: 'pink' }, () => belongs[belongs_to]);
    },
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
    field: 'host_type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '物理机', value: 'idc' },
        { label: '云主机', value: 'cloud' },
        { label: '本地虚拟机', value: 'local' },
      ],
    },
    colProps: { span: 5 },
  },
  {
    field: 'belongs_to',
    label: '归属',
    component: 'Select',
    componentProps: {
      options: [
        { label: '本地机房', value: 'local' },
        { label: 'IDC', value: 'idc' },
        { label: '阿里云', value: 'aliyun' },
        { label: '腾讯云', value: 'tencent' },
        { label: '百度云', value: 'baidu' },
        { label: '华为云', value: 'huawei' },
        { label: '京东云', value: 'jingdong' },
        { label: '金山云', value: 'jinshan' },
        { label: '七牛云', value: 'qiniu' },
        { label: 'UCloud', value: 'ucloud' },
        { label: 'AWS', value: 'aws' },
        { label: 'AZURE', value: 'azure' },
      ],
    },
    colProps: { span: 5 },
  },
];

export const hostFormSchema: FormSchema[] = [
  {
    field: 'intranet_ip',
    label: '内网IP',
    component: 'Input',
    required: true,
  },
  {
    field: 'external_ip',
    label: '外网IP',
    component: 'Input',
    required: true,
  },
  {
    label: 'ssh用户名',
    field: 'login_user',
    component: 'Input',
    required: true,
  },
  {
    label: 'ssh端口',
    field: 'port',
    component: 'Input',
    defaultValue: 22,
    required: true,
  },
  {
    label: 'ssh密码',
    field: 'password',
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'host_group_id',
    label: '所属主机组',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    required: true,
  },
  {
    field: 'host_type',
    label: '主机类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '物理机', value: 'idc' },
        { label: '云主机', value: 'cloud' },
        { label: '本地虚拟机', value: 'local' },
      ],
    },
    required: true,
  },
  {
    field: 'belongs_to',
    label: '归属',
    component: 'Select',
    componentProps: {
      options: [
        { label: '本地机房', value: 'local' },
        { label: 'IDC', value: 'idc' },
        { label: '阿里云', value: 'aliyun' },
        { label: '腾讯云', value: 'tencent' },
        { label: '百度云', value: 'baidu' },
        { label: '华为云', value: 'huawei' },
        { label: '京东云', value: 'jingdong' },
        { label: '金山云', value: 'jinshan' },
        { label: '七牛云', value: 'qiniu' },
        { label: 'UCloud', value: 'ucloud' },
        { label: 'AWS', value: 'aws' },
        { label: 'AZURE', value: 'azure' },
      ],
    },
    required: true,
  },
  {
    label: '代理IP组',
    field: 'proxy_ips',
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入代理IP，多个IP请以英文逗号隔开',
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

export const basicInfoSchema: DescItem[] = [
  {
    label: '内网IP',
    field: 'intranet_ip',
  },
  {
    label: '外网IP',
    field: 'external_ip',
  },
  {
    label: '类型',
    field: 'host_type',
    render: (val) => {
      let color = '';
      let text = '';
      if (val === 'local') {
        color = 'green';
        text = '本地虚拟机';
      } else if (val === 'cloud') {
        color = 'blue';
        text = '云主机';
      } else {
        color = 'yellow';
        text = '物理机';
      }
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    label: '归属厂商',
    field: 'belongs_to',
    render: (val) => {
      const belongs = {
        local: '本地机房',
        idc: 'IDC',
        aliyun: '阿里云',
        tencent: '腾讯云',
        baidu: '百度云',
        huawei: '华为云',
        jingdong: '京东云',
        jinshan: '金山云',
        qiniu: '七牛云',
        ucloud: 'UCloud',
        aws: 'AWS',
        azure: 'AZURE',
      };
      return h(Tag, { color: 'pink' }, () => belongs[val]);
    },
  },
  {
    label: 'ssh用户名',
    field: 'login_user',
  },
  {
    label: 'ssh端口',
    field: 'port',
  },
  {
    label: '网卡最大带宽(MB)',
    field: 'max_bandwidth',
    span: 2,
  },
  {
    label: '备注',
    field: 'remark',
    span: 2,
  },
];

export const deviceAndSystemInfoSchema: DescItem[] = [
  {
    label: '服务器制造商',
    field: 'manufacturer',
  },
  {
    label: '系统序列号',
    field: 'sn',
  },
  {
    label: '服务器UUID',
    field: 'uuid',
  },
  {
    label: '服务器型号',
    field: 'product_name',
  },
  {
    label: '系统厂商',
    field: 'distributor',
  },
  {
    label: '系统版本号',
    field: 'release_version',
  },
  {
    label: '内核版本号',
    field: 'kernel_version',
  },
];

export const cpuAndMemoryInfoSchema: DescItem[] = [
  {
    label: '逻辑CPU个数',
    field: 'processor_num',
  },
  {
    label: '物理CPU个数',
    field: 'physical_num',
  },
  {
    label: '核数',
    field: 'core_num',
  },
  {
    label: '物理内存(MB)',
    field: 'mem_total',
  },
  {
    label: 'swap缓存(MB)',
    field: 'swap_total',
  },
];

export const diskColumns: ColumnsType<any> = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '容量',
    dataIndex: 'capacity',
    key: 'capacity',
    align: 'center',
  },
  {
    title: '接口类型',
    dataIndex: 'interface_type',
    key: 'interface_type',
    align: 'center',
  },
];

export const hostGroupFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'parent_id',
    label: '父主机组',
    component: 'TreeSelect',
    required: false,
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    required: false,
  },
];

export const associateFormSchema: FormSchema[] = [
  {
    field: 'host_group_id',
    label: '主机组',
    component: 'TreeSelect',
    required: true,
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
];
