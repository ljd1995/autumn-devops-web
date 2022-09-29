import { FormSchema } from '/@/components/Form';

export const scriptFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'parent_id',
    label: '父脚本组',
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
    field: 'node_type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '脚本组', value: 'group' },
        { label: '脚本', value: 'node' },
      ],
    },
    required: true,
  },
  {
    field: 'exec_command',
    label: '脚本执行程序',
    component: 'Select',
    componentProps: {
      options: [
        { label: 'shell', value: 'shell' },
        { label: 'python2', value: 'py2' },
        { label: 'python3', value: 'py3' },
        { label: 'go', value: 'go' },
        { label: 'ansible', value: 'ansible' },
      ],
    },
    required: false,
  },
];
