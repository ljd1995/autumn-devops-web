import { defHttp } from '/@/utils/http/axios';

import {
  DepartmentDataModel,
  DepartmentListGetResultModel,
  DepartmentListItem,
  DepartmentListParam,
  DepartmentDataParam,
  DepartmentBaseModel,
} from './model/deptModel';

enum Api {
  DepartmentData = '/rbac/department/children',
  Department = '/rbac/department',
}

export function getDepartmentData(params: DepartmentDataParam) {
  return defHttp.get<DepartmentDataModel>({ url: Api.DepartmentData, params });
}

export function getDepartmentPageList(params: DepartmentListParam) {
  return defHttp.get<DepartmentListGetResultModel>({ url: Api.Department, params });
}

export function createDepartment(params: DepartmentBaseModel) {
  return defHttp.post<DepartmentListItem>({ url: Api.Department, params });
}

export function updateDepartment(id: any, params: DepartmentBaseModel) {
  return defHttp.put<DepartmentListItem>({ url: Api.Department + '/' + id, params });
}

export function deleteDepartment(id: any) {
  return defHttp.delete({ url: Api.Department + '/' + id });
}
