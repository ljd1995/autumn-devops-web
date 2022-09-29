import { defHttp } from '/@/utils/http/axios';

import {
  RoleCreateParam,
  RoleListGetResultModel,
  RoleListItem,
  RoleListParam,
  RoleUpdateParam,
} from './model/roleModel';

enum Api {
  Role = '/role',
}

export function getRolePageList(params: RoleListParam) {
  return defHttp.get<RoleListGetResultModel>({ url: Api.Role, params });
}

export function createRole(params: RoleCreateParam) {
  return defHttp.post<RoleListItem>({ url: Api.Role, params });
}

export function updateRole(id: any, params: RoleUpdateParam) {
  return defHttp.put<RoleListItem>({ url: Api.Role + '/' + id, params });
}

export function deleteRole(id: any) {
  return defHttp.delete({ url: Api.Role + '/' + id });
}
