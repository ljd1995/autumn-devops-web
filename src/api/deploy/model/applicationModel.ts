import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';
import { EnvGroupListItem } from './envGroupModel';

export interface ApplicationListParam extends BasicPageParams {
  search?: string;
}

export interface ApplicationBaseModel {
  name: string;
  module_name: string;
  service_name: string;
  remark: string;
  principal: string;
  git_url: string;
  language: string;
  language_version: string;
  parameters: string;
  port: string;
  dockerfile_url: string;
  helm_chart_url: string;
  git_config_id: string;
  application_groups: EnvGroupListItem[];
}

export interface ApplicationListItem extends ApplicationBaseModel {
  id: number;
  create_time: string;
  update_time: string;
  create_user: string;
  update_user: string;
}

export type ApplicationListGetResultModel = BasicFetchResult<ApplicationListItem>;
