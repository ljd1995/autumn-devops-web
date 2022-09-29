import { defHttp } from '/@/utils/http/axios';

import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  RefreshTokenParams,
  RefreshTokenResultModel,
} from './model/authModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/token',
  Logout = '/token',
  GetUserInfo = '/token/me',
  RefreshToken = '/token/refresh',
  GetPermCode = '/getPermCode',
  DepartmentData = '/department/children',
  User = '/user',
}
export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}
/**
 * @description: user login api
 */
export function doLogin(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function doLogout() {
  return defHttp.delete({ url: Api.Logout });
}

export function doRefreshToken(params: RefreshTokenParams) {
  return defHttp.post<RefreshTokenResultModel>({ url: Api.RefreshToken, params });
}
