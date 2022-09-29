import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface HostGroupDataModel {
  name: string;
  code: string;
  id: string | number;
  remark: string;
  create_time: string;
  update_time: string;
  status: string | number;
  children?: HostGroupDataModel[];
}

export interface HostGroupListParam extends BasicPageParams {
  search?: string;
}

export interface HostGroupDataParam {
  search?: string;
}

export interface HostGroupBaseModel {
  name: string;
  remark: string;
  parent_id: string | number;
}

export interface HostGroupListItem extends HostGroupBaseModel {
  create_time: string;
  update_time: string;
  id: string | number;
}

export type HostGroupListGetResultModel = BasicFetchResult<HostGroupListItem>;
