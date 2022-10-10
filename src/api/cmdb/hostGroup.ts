import { defHttp } from '/@/utils/http/axios';

import {
  HostGroupDataModel,
  HostGroupListGetResultModel,
  HostGroupListItem,
  HostGroupListParam,
  HostGroupDataParam,
  HostGroupBaseModel,
} from './model/hostGroupModel';

enum Api {
  HostGroupData = '/cmdb/host-group/children',
  HostGroupDataWithHost = '/cmdb/host-group/children-host',
  HostGroup = '/cmdb/host-group',
}

export function getHostGroupData(params: HostGroupDataParam) {
  return defHttp.get<HostGroupDataModel>({ url: Api.HostGroupData, params });
}

export function getHostGroupDataWithHost() {
  return defHttp.get<HostGroupDataModel>({ url: Api.HostGroupDataWithHost });
}

export function getHostGroupPageList(params: HostGroupListParam) {
  return defHttp.get<HostGroupListGetResultModel>({ url: Api.HostGroup, params });
}

export function createHostGroup(params: HostGroupBaseModel) {
  return defHttp.post<HostGroupListItem>({ url: Api.HostGroup, params });
}

export function updateHostGroup(id: any, params: HostGroupBaseModel) {
  return defHttp.put<HostGroupListItem>({ url: Api.HostGroup + '/' + id, params });
}

export function deleteHostGroup(id: any) {
  return defHttp.delete({ url: Api.HostGroup + '/' + id });
}
