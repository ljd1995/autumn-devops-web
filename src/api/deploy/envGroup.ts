import {
  EnvGroupBaseModel,
  EnvGroupListGetResultModel,
  EnvGroupListItem,
  EnvGroupListParam,
} from './model/envGroupModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  EnvGroup = '/app/env-group',
}

export function getEnvGroupPageList(params: EnvGroupListParam) {
  return defHttp.get<EnvGroupListGetResultModel>({ url: Api.EnvGroup, params });
}

export function createEnvGroup(params: EnvGroupBaseModel) {
  return defHttp.post<EnvGroupListItem>({ url: Api.EnvGroup, params });
}

export function updateEnvGroup(id: any, params: EnvGroupBaseModel) {
  return defHttp.put<EnvGroupListItem>({ url: Api.EnvGroup + '/' + id, params });
}

export function deleteEnvGroup(id: any) {
  return defHttp.delete({ url: Api.EnvGroup + '/' + id });
}
