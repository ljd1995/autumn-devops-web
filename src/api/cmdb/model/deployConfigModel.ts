import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface DeployConfigListParam extends BasicPageParams {
  search?: string;
}

interface Parameters {
  token?: string;
  registry?: string;
  username?: string;
  password?: string;
  address?: string;
  config_yaml?: string;
}

export interface DeployConfigBaseModel {
  name: string;
  parameters: Parameters;
  type: string;
  remark: string;
}

export interface DeployConfigListItem extends DeployConfigBaseModel {
  id: number;
  create_time: string;
  update_time: string;
}

export type DeployConfigListGetResultModel = BasicFetchResult<DeployConfigListItem>;
