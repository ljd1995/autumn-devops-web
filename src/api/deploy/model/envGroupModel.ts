import { HostListItem } from '../../cmdb/model/hostModel';
import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface EnvGroupListParam extends BasicPageParams {
  search?: string;
}

export interface EnvGroupBaseModel {
  name: string;
  remark: string;
  branch_name: string;
  config_center_ns: string;
  k8s_ns: string;
  create_user: string;
  update_user: string;
  application_id: number;
  config_center_id: number;
  db_id: number;
  environment_id: number;
  k8s_config_id: number;
  registry_config_id: number;
  hosts: HostListItem[];
}

export interface EnvGroupListItem extends EnvGroupBaseModel {
  id: number;
  create_time: string;
  update_time: string;
  create_user: string;
  update_user: string;
}

export type EnvGroupListGetResultModel = BasicFetchResult<EnvGroupListItem>;
