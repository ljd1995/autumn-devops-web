import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface HostListParam extends BasicPageParams {
  host_group_id?: string;
  search?: string;
}

export interface HostBaseModel {
  intranet_ip: string;
  external_ip: string;
  host_type: string;
  belongs_to: string;
  login_user: string;
  password: string;
  port: number;
  host_group_id: number;
  remark: string;
  proxy_ips: string;
}

export interface DiskItem {
  name: string;
  capacity: string;
  interface_type: string;
}

export interface HostListItem extends HostBaseModel {
  create_time: string;
  update_time: string;
  id: string | number;
  manufacturer: string;
  sn: string;
  uuid: string;
  product_name: string;
  distributor: string;
  release_version: string;
  kernel_version: string;
  model_name: string;
  processor_num: string;
  physical_num: string;
  mem_total: string;
  swap_total: string;
  max_bandwidth: string;
  disks: DiskItem[];
}

export interface AssociateHostGroupParam {
  host_group_id: string;
  host_ids: number[];
}

export type HostListGetResultModel = BasicFetchResult<HostListItem>;
