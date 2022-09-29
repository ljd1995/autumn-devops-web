import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface UserListParam extends BasicPageParams {
  status?: string;
  department_id?: string;
  search?: string;
}

export interface UserBaseModel {
  username: string;
  nick_name: string;
  phone: string;
  avatar: string;
  email: string;
  introduction: string;
  last_login_ip?: string;
  department_id: string | number;
}

export interface UserListItem extends UserBaseModel {
  last_login_time: string;
  create_time: string;
  update_time: string;
  id: string | number;
}

export interface UserCreateParam extends UserBaseModel {
  password: string;
}

export interface UserUpdateParam extends UserBaseModel {
  status: number;
}

export interface modifyUserPasswordParam {
  username: string;
  password_old: string;
  password_new: string;
}

export type UserListGetResultModel = BasicFetchResult<UserListItem>;
