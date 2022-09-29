import { FormSchema } from '/@/components/Form';

export const wikiCategoryPageFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'parent_id',
    label: '父目录',
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
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '页面', value: 'page' },
        { label: '目录', value: 'category' },
      ],
    },
    defaultValue: 'page',
    required: true,
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    required: false,
  },
];
