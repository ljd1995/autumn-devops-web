import {
  HostBaseModel,
  HostListGetResultModel,
  HostListItem,
  HostListParam,
  AssociateHostGroupParam,
} from './model/hostModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Host = '/host',
  AssociateHostGroup = '/host/host-group',
}

export function getHostPageList(params: HostListParam) {
  return defHttp.get<HostListGetResultModel>({ url: Api.Host, params });
}

export function createHost(params: HostBaseModel) {
  return defHttp.post<HostListItem>({ url: Api.Host, params });
}

export function updateHost(id: any, params: HostBaseModel) {
  return defHttp.put<HostListItem>({ url: Api.Host + '/' + id, params });
}

export function deleteHost(id: any) {
  return defHttp.delete({ url: Api.Host + '/' + id });
}

export function associateHostGroup(params: AssociateHostGroupParam) {
  return defHttp.post({ url: Api.AssociateHostGroup, params });
}
