import {
  ConfigCenterBaseModel,
  ConfigCenterListGetResultModel,
  ConfigCenterListItem,
  ConfigCenterListParam,
} from './model/configCenterModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  ConfigCenter = '/cmdb/config-center',
}

export function getConfigCenterPageList(params: ConfigCenterListParam) {
  return defHttp.get<ConfigCenterListGetResultModel>({ url: Api.ConfigCenter, params });
}

export function getConfigCenterInfo(id: any) {
  return defHttp.get<ConfigCenterListItem>({ url: Api.ConfigCenter + '/' + id });
}

export function createConfigCenter(params: ConfigCenterBaseModel) {
  return defHttp.post<ConfigCenterListItem>({ url: Api.ConfigCenter, params });
}

export function updateConfigCenter(id: any, params: ConfigCenterBaseModel) {
  return defHttp.put<ConfigCenterListItem>({ url: Api.ConfigCenter + '/' + id, params });
}

export function deleteConfigCenter(id: any) {
  return defHttp.delete({ url: Api.ConfigCenter + '/' + id });
}
