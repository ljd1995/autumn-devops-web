import { Step, Steps } from 'ant-design-vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建人',
    dataIndex: 'create_user',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
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
];

export const cicdPluginColumns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 160,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const cicdPluginSearchFormSchema: FormSchema[] = [
  {
    field: 'search',
    label: '搜索',
    component: 'Input',
    componentProps: {
      placeholder: '输入关键字全局搜索',
    },
    colProps: { span: 15 },
  },
];

export const pipelineColumns: BasicColumn[] = [
  {
    title: '流水线名称',
    dataIndex: 'name',
    width: 110,
  },
  {
    title: '环境名称',
    dataIndex: 'envName',
    width: 100,
  },
  {
    title: '流水线',
    dataIndex: 'plugins',
    customRender: ({ record }) => {
      return (
        <Steps progress-dot size="small">
          {record.plugins.map((item, index) => {
            return (
              <Step
                key={index}
                title={item.default_parameters.name ? item.default_parameters.name : item.name}
              ></Step>
            );
          })}
        </Steps>
      );
    },
  },
];

export const pipelineFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '流水线名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'envName',
    label: '环境',
    required: true,
    component: 'Select',
  },
];
