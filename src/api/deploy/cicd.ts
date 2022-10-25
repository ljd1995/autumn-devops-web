import {
  ArtifactBaseModel,
  ArtifactListGetResultModel,
  ArtifactListItem,
  ArtifactListParam,
  CICDPluginListGetResultModel,
  CICDPluginListParam,
} from './model/cicdModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Artifact = '/cicd/artifact',
  CICDPlugin = '/cicd/plugin',
}

export function getArtifactPageList(params: ArtifactListParam) {
  return defHttp.get<ArtifactListGetResultModel>({ url: Api.Artifact, params });
}

export function getArtifactInfo(id: any) {
  return defHttp.get<ArtifactListItem>({ url: Api.Artifact + '/' + id });
}

export function createArtifact(params: ArtifactBaseModel) {
  return defHttp.post<ArtifactListItem>({ url: Api.Artifact, params });
}

export function updateArtifact(id: any, params: ArtifactBaseModel) {
  return defHttp.put<ArtifactListItem>({ url: Api.Artifact + '/' + id, params });
}

export function deleteArtifact(id: any) {
  return defHttp.delete({ url: Api.Artifact + '/' + id });
}

export function getCICDPluginPageList(params: CICDPluginListParam) {
  return defHttp.get<CICDPluginListGetResultModel>({ url: Api.CICDPlugin, params });
}
