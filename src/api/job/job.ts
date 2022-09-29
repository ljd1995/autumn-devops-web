import {
  AdhocHistoryListGetResultModel,
  AdhocHistoryListParam,
  ExecModuleParam,
  ExecTaskParam,
  ScriptBaseModel,
  ScriptChildrenModel,
  ScriptHistoryModel,
  ScriptListItem,
  ScriptOptionModel,
} from './model/jobModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  AdhocHistory = '/job/adhoc-history',
  ExecModule = '/job/module',
  ExecTask = '/job/task',
  Script = '/job/script',
  ScriptChildren = '/job/script/children',
  ScriptHistory = '/job/script/history',
  ScriptOptions = '/job/script/options',
}

export function getAdhocHistoryPageList(params: AdhocHistoryListParam) {
  return defHttp.get<AdhocHistoryListGetResultModel>({ url: Api.AdhocHistory, params });
}

export function ExecModule(params: ExecModuleParam) {
  return defHttp.post<string>({ url: Api.ExecModule, params });
}

export function ExecTask(params: ExecTaskParam) {
  return defHttp.post<string>({ url: Api.ExecTask, params });
}

export function getScriptGroupData() {
  return defHttp.get<ScriptChildrenModel>({ url: Api.ScriptChildren });
}

export function getScriptInfo(id: any) {
  return defHttp.get<ScriptListItem>({ url: Api.Script + '/' + id });
}

export function createScript(params: ScriptBaseModel) {
  return defHttp.post<ScriptListItem>({ url: Api.Script, params });
}

export function updateScript(id: any, params: ScriptBaseModel) {
  return defHttp.put<ScriptListItem>({ url: Api.Script + '/' + id, params });
}

export function deleteScript(id: any) {
  return defHttp.delete({ url: Api.Script + '/' + id });
}

export function getScriptHistory(id: any) {
  return defHttp.get<ScriptHistoryModel>({ url: Api.ScriptHistory + '/' + id });
}

export function getScriptOptions() {
  return defHttp.get<ScriptOptionModel>({ url: Api.ScriptOptions });
}
