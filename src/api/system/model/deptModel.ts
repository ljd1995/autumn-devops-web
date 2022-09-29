import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface DepartmentDataModel {
  name: string;
  code: string;
  id: string | number;
  remark: string;
  create_time: string;
  update_time: string;
  status: string | number;
  children?: DepartmentDataModel[];
}

export interface DepartmentListParam extends BasicPageParams {
  status?: string;
  search?: string;
}

export interface DepartmentDataParam {
  status?: string;
  search?: string;
}

export interface DepartmentBaseModel {
  name: string;
  code: string;
  remark: string;
  status: string | number;
  parent_id: string;
}

export interface DepartmentListItem extends DepartmentBaseModel {
  create_time: string;
  update_time: string;
  id: string | number;
  children?: DepartmentDataModel[];
}

export type DepartmentListGetResultModel = BasicFetchResult<DepartmentListItem>;
