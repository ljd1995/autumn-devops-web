import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface RoleListParam extends BasicPageParams {
  status?: string;
  search?: string;
}

export interface RoleCreateParam {
  name: string;
  code: string;
  remark: string;
}

export interface RoleUpdateParam extends RoleCreateParam {
  status: number;
}

export interface RoleListItem extends RoleCreateParam {
  id: string | number;
  status: number;
  create_time: string;
}

export type RoleListGetResultModel = BasicFetchResult<RoleListItem>;
