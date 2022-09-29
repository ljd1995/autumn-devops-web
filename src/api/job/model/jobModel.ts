import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface AdhocHistoryListParam extends BasicPageParams {
  search?: string;
  username?: string;
}

export interface AdhocHistoryListItem {
  username: string;
  host_pattern: string;
  module: string;
  module_args: string;
  fork: number;
  host_group_id: number;
  create_time: string;
  host_group_name: string;
}

export interface ExecModuleParam {
  host_pattern: string;
  module: string;
  module_args: string;
  fork: number;
  host_group_id: number;
}

export interface ExecTaskParam {
  host_pattern: string;
  content: string;
  exec_command: string;
  host_group_id: number;
}

export interface ScriptChildrenModel {
  id: number;
  create_time: string;
  update_time: string;
  name: string;
  content: string;
  exec_command: string;
  remark: string;
  node_type: string;
  create_user: string;
  update_user: string;
  parent_id?: any;
  children: ScriptChildrenModel[];
}

export interface ScriptBaseModel {
  name: string;
  content: string;
  exec_command: string;
  remark?: string;
  node_type: string;
  create_user?: string;
  update_user?: string;
  parent_id?: any;
  children: ScriptChildrenModel[];
}

export interface ScriptHistoryModel {
  id: number;
  old_content: string;
  new_content: string;
  md5: string;
  update_user: string;
  update_time: string;
  script_id: number;
}

export interface ScriptOptionModel {
  label: string;
  options: ScriptOptionItem[];
}

interface ScriptOptionItem {
  label: string;
  value: string;
}

export interface ScriptListItem extends ScriptBaseModel {
  create_time: string;
  update_time: string;
  id: string | number;
}

export type AdhocHistoryListGetResultModel = BasicFetchResult<AdhocHistoryListItem>;
