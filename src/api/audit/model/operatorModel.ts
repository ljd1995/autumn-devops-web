import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface OperatorListParam extends BasicPageParams {
  search?: string;
  usernmae?: string;
}

export interface SshListParam extends BasicPageParams {
  search?: string;
  usernmae?: string;
}

export interface OperatorListItem {
  username: string;
  request_url: number;
  request_method: string;
  request_body: string;
  response_code: number;
  response_content: string;
  request_time: string;
  process_time: number;
}

export interface SshListItem {
  id: number;
  create_time: string;
  update_time: string;
  username: string;
  ssh_host: string;
  ssh_user: string;
  proxy_host: string;
  status: number;
  ssh_command: string;
}
export type OperatorListGetResultModel = BasicFetchResult<OperatorListItem>;
export type SshListGetResultModel = BasicFetchResult<SshListItem>;
