import { defHttp } from '/@/utils/http/axios';

enum Api {
  Dependencies = '/common/dependencies',
}

export function getDependencies() {
  return defHttp.get<object>({ url: Api.Dependencies });
}
