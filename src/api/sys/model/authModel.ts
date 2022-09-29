/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  access_token: string;
  refresh_token: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  username: string;
  nick_name: string;
  id: string | number;
  phone: string;
  avatar: string;
  email: string;
  introduction: string;
  last_login_ip: string;
  last_login_time: string;
}

export interface RefreshTokenParams {
  refresh_token: string;
}

export interface RefreshTokenResultModel {
  access_token: string;
}
