import {
  ApplicationBaseModel,
  ApplicationListGetResultModel,
  ApplicationListItem,
  ApplicationListParam,
} from './model/applicationModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Application = '/app/application',
}

export function getApplicationPageList(params: ApplicationListParam) {
  return defHttp.get<ApplicationListGetResultModel>({ url: Api.Application, params });
}

export function getApplicationInfo(id: any) {
  return defHttp.get<ApplicationListItem>({ url: Api.Application + '/' + id });
}

export function createApplication(params: ApplicationBaseModel) {
  return defHttp.post<ApplicationListItem>({ url: Api.Application, params });
}

export function updateApplication(id: any, params: ApplicationBaseModel) {
  return defHttp.put<ApplicationListItem>({ url: Api.Application + '/' + id, params });
}

export function deleteApplication(id: any) {
  return defHttp.delete({ url: Api.Application + '/' + id });
}
