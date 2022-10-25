import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface ArtifactListParam extends BasicPageParams {
  search?: string;
}

export interface CICDPluginListParam extends BasicPageParams {
  search?: string;
}

export interface ArtifactBaseModel {
  name: string;
  remark: string;
}

export interface ArtifactListItem extends ArtifactBaseModel {
  id: number;
  create_time: string;
  update_time: string;
  create_user: string;
  update_user: string;
}

export interface CICDPluginListItem {
  id: number;
  create_time: string;
  update_time: string;
  name: string;
  default_parameters: Defaultparameters;
  remark: string;
}

interface Defaultparameters {
  key?: string;
  group?: string;
  content?: string;
  data_id?: string;
  namespace?: string;
  config_center_id?: string;
  sql?: string;
  db_id?: string;
  module_name?: string;
  service_name?: string;
  image_tag?: string;
  image_name?: string;
  docker_image_name?: string;
  cmd?: string;
  git_url?: string;
  branch_name?: string;
  config_id?: string;
}

export type ArtifactListGetResultModel = BasicFetchResult<ArtifactListItem>;
export type CICDPluginListGetResultModel = BasicFetchResult<CICDPluginListItem>;
