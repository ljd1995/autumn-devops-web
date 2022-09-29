import { defHttp } from '/@/utils/http/axios';

import { WikiCategoryChildrenParam, WikiCategoryDataModel } from './model/wikiCategoryModel';

enum Api {
  WikiCategoryDataWithPage = '/wiki/children-page',
  WikiCategory = '/wiki/category',
}

export function getWikiCategoryDataWithPage(zone_id: string) {
  return defHttp.get<WikiCategoryDataModel>({
    url: Api.WikiCategoryDataWithPage,
    params: { zone_id },
  });
}

export function createWikiCategory(params: WikiCategoryChildrenParam) {
  return defHttp.post<WikiCategoryDataModel>({ url: Api.WikiCategory, params });
}

export function updateWikiCategory(id: any, params: WikiCategoryChildrenParam) {
  return defHttp.put<WikiCategoryDataModel>({ url: Api.WikiCategory + '/' + id, params });
}

export function deleteWikiCategory(id: any) {
  return defHttp.delete({ url: Api.WikiCategory + '/' + id });
}
