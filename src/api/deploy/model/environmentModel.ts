import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface EnvironmentListParam extends BasicPageParams {
  search?: string;
}

export interface EnvironmentBaseModel {
  name: string;
  remark: string;
}

export interface EnvironmentListItem extends EnvironmentBaseModel {
  id: number;
  create_time: string;
  update_time: string;
}

export type EnvironmentListGetResultModel = BasicFetchResult<EnvironmentListItem>;
