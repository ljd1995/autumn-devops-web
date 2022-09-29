import {
  WikiZoneBaseModel,
  WikiZoneListGetResultModel,
  WikiZoneListItem,
  WikiZoneListParam,
} from './model/wikiZoneModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  WikiZone = '/wiki/zone',
}

export function getWikiZonePageList(params: WikiZoneListParam) {
  return defHttp.get<WikiZoneListGetResultModel>({ url: Api.WikiZone, params });
}

export function createWikiZone(params: WikiZoneBaseModel) {
  return defHttp.post<WikiZoneListItem>({ url: Api.WikiZone, params });
}

export function updateWikiZone(id: any, params: WikiZoneBaseModel) {
  return defHttp.put<WikiZoneListItem>({ url: Api.WikiZone + '/' + id, params });
}

export function deleteWikiZone(id: any) {
  return defHttp.delete({ url: Api.WikiZone + '/' + id });
}
