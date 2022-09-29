import { Modal } from 'ant-design-vue';
import { h } from 'vue';
import { getUserPageList } from '/@/api/system/user';
import { JsonPreview } from '/@/components/CodeEditor';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 100,
  },
  {
    title: '请求方法',
    dataIndex: 'request_method',
    width: 90,
  },
  {
    title: '请求URL',
    dataIndex: 'request_url',
    width: 320,
  },
  {
    title: '请求参数',
    dataIndex: 'request_body',
    customRender: ({ record }) => {
      if (record.request_body) {
        return (
          <span
            onMouseover={() => {
              Modal.info({
                title: '请求参数',
                content: h(JsonPreview, { data: JSON.parse(record.request_body) }),
              });
            }}
          >
            {record.request_body}
          </span>
        );
      } else {
        return '';
      }
    },
  },
  {
    title: '响应码',
    dataIndex: 'response_code',
    width: 70,
  },
  {
    title: '响应内容',
    dataIndex: 'response_content',
    customRender: ({ record }) => {
      if (record.response_content) {
        return (
          <span
            onMouseover={() => {
              Modal.info({
                title: '响应内容',
                content: h(JsonPreview, { data: JSON.parse(record.response_content) }),
                width: '45%',
              });
            }}
          >
            {record.request_body}
          </span>
        );
      } else {
        return '';
      }
    },
  },
  {
    title: '请求时间',
    dataIndex: 'request_time',
    width: 170,
  },
  {
    title: '耗时时间(s)',
    dataIndex: 'process_time',
    width: 100,
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
