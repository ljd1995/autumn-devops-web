import {
  OperatorListGetResultModel,
  SshListGetResultModel,
  OperatorListParam,
  SshListParam,
} from './model/operatorModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Operator = '/audit/operator-history',
  Ssh = '/audit/ssh-history',
}

export function getOperatorPageList(params: OperatorListParam) {
  return defHttp.get<OperatorListGetResultModel>({ url: Api.Operator, params });
}

export function getSshPageList(params: SshListParam) {
  return defHttp.get<SshListGetResultModel>({ url: Api.Ssh, params });
}
