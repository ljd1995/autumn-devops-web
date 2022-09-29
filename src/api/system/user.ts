import { defHttp } from '/@/utils/http/axios';

import {
  modifyUserPasswordParam,
  UserCreateParam,
  UserListGetResultModel,
  UserListItem,
  UserListParam,
  UserUpdateParam,
} from './model/userModel';

enum Api {
  User = '/user',
  ModifyUserPassword = '/user/password',
}

export function getUserPageList(params: UserListParam) {
  return defHttp.get<UserListGetResultModel>({ url: Api.User, params });
}

export function createUser(params: UserCreateParam) {
  return defHttp.post<UserListItem>({ url: Api.User, params });
}

export function updateUser(id: any, params: UserUpdateParam) {
  return defHttp.put<UserListItem>({ url: Api.User + '/' + id, params });
}

export function deleteUser(id: any) {
  return defHttp.delete({ url: Api.User + '/' + id });
}

export function modifyUserPassword(params: modifyUserPasswordParam) {
  return defHttp.post({ url: Api.ModifyUserPassword, params });
}
