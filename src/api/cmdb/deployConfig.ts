import {
  DeployConfigBaseModel,
  DeployConfigListGetResultModel,
  DeployConfigListItem,
  DeployConfigListParam,
} from './model/deployConfigModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  DeployConfig = '/cmdb/deploy-config',
}

export function getDeployConfigPageList(params: DeployConfigListParam) {
  return defHttp.get<DeployConfigListGetResultModel>({ url: Api.DeployConfig, params });
}

export function createDeployConfig(params: DeployConfigBaseModel) {
  return defHttp.post<DeployConfigListItem>({ url: Api.DeployConfig, params });
}

export function updateDeployConfig(id: any, params: DeployConfigBaseModel) {
  return defHttp.put<DeployConfigListItem>({ url: Api.DeployConfig + '/' + id, params });
}

export function deleteDeployConfig(id: any) {
  return defHttp.delete({ url: Api.DeployConfig + '/' + id });
}
