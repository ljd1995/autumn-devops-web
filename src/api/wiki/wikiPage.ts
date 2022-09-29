import { WikiPageBaseModel, WikiPageListItem } from './model/wikiPageModel';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  WikiPage = '/wiki/page',
  WikiPageUploadFile = '/wiki/page/file',
}

const { uploadUrl } = useGlobSetting();

export function getWikiPageInfo(id: any) {
  return defHttp.get<WikiPageListItem>({ url: Api.WikiPage + '/' + id });
}

export function createWikiPage(params: WikiPageBaseModel) {
  return defHttp.post<WikiPageListItem>({ url: Api.WikiPage, params });
}

export function updateWikiPage(id: any, params: WikiPageBaseModel) {
  return defHttp.put<WikiPageListItem>({ url: Api.WikiPage + '/' + id, params });
}

export function deleteWikiPage(id: any) {
  return defHttp.delete({ url: Api.WikiPage + '/' + id });
}

export function WikiPageUploadFile(params: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: uploadUrl + Api.WikiPageUploadFile,
    },
    params,
  );
}
