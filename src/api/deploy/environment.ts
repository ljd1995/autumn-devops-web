import {
  EnvironmentBaseModel,
  EnvironmentListGetResultModel,
  EnvironmentListItem,
  EnvironmentListParam,
} from './model/environmentModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Environment = '/app/environment',
}

export function getEnvironmentPageList(params: EnvironmentListParam) {
  return defHttp.get<EnvironmentListGetResultModel>({ url: Api.Environment, params });
}

export function getEnvironmentInfo(id: any) {
  return defHttp.get<EnvironmentListItem>({ url: Api.Environment + '/' + id });
}

export function createEnvironment(params: EnvironmentBaseModel) {
  return defHttp.post<EnvironmentListItem>({ url: Api.Environment, params });
}

export function updateEnvironment(id: any, params: EnvironmentBaseModel) {
  return defHttp.put<EnvironmentListItem>({ url: Api.Environment + '/' + id, params });
}

export function deleteEnvironment(id: any) {
  return defHttp.delete({ url: Api.Environment + '/' + id });
}
