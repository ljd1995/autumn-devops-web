import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface WikiZoneListParam extends BasicPageParams {
  search?: string;
  username?: string;
}

export interface WikiZoneBaseModel {
  name: string;
  cover_image_url: string;
  remark: string;
}

export interface WikiZoneListItem extends WikiZoneBaseModel {
  create_time: string;
  update_time: string;
  create_user: string;
  id: string | number;
}

export type WikiZoneListGetResultModel = BasicFetchResult<WikiZoneListItem>;
