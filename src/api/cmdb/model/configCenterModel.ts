import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface ConfigCenterListParam extends BasicPageParams {
  search?: string;
}

export interface ConfigCenterBaseModel {
  address: string;
  port: number;
  type: string;
  version: string;
  username: string;
  password: string;
  remark: string;
}

export interface ConfigCenterListItem extends ConfigCenterBaseModel {
  create_time: string;
  update_time: string;
  id: string | number;
}

export type ConfigCenterListGetResultModel = BasicFetchResult<ConfigCenterListItem>;
