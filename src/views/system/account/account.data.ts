import { Switch, Avatar } from 'ant-design-vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useMessage } from '/@/hooks/web/useMessage';
import { h } from 'vue';
import { updateUser } from '/@/api/system/user';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'nick_name',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === 0,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 0 : 1;
          const { createMessage } = useMessage();
          const data = {
            username: record.username,
            nick_name: record.nick_name,
            phone: record.phone,
            email: record.email,
            avatar: record.avatar,
            introduction: record.introduction,
            last_login_ip: record.last_login_ip,
            status: newStatus,
            department_id: record.department_id,
          };
          updateUser(record.id, data)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`已成功修改用户状态`);
            })
            .catch(() => {
              createMessage.error('修改用户状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 90,
    customRender: ({ record }) => {
      return h(Avatar, {
        size: 48,
        src: record.avatar,
        alt: '暂无头像',
      });
    },
  },
  {
    title: '手机',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 160,
  },
  {
    title: '描述',
    dataIndex: 'introduction',
  },
  {
    title: '上次登陆时间',
    dataIndex: 'last_login_time',
  },
  {
    title: '上次登陆IP',
    dataIndex: 'last_login_ip',
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
    colProps: { span: 10 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 },
      ],
    },
    colProps: { span: 5 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    required: true,
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: false,
  },
  {
    field: 'department_id',
    label: '所属部门',
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
    field: 'nick_name',
    label: '昵称',
    component: 'Input',
    required: true,
  },
  {
    field: 'qq',
    label: 'qq号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入QQ号，用于从腾讯官方API获取QQ头像',
    },
    required: true,
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'Input',
    componentProps: {
      placeholder: '填写一个头像url或者不填，由系统获取QQ头像生成',
    },
    required: false,
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true,
  },
  {
    label: '手机号',
    field: 'phone',
    component: 'Input',
    required: true,
  },
  {
    label: '备注',
    field: 'introduction',
    component: 'InputTextArea',
  },
];
