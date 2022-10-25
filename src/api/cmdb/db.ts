import {
  ColumnItem,
  DbBaseModel,
  DbExecuteSqlParam,
  DbListGetResultModel,
  DbListItem,
  DbListParam,
  GetDbColumnParam,
  GetDbSchemaParam,
  GetDbTableParam,
  TableItem,
} from './model/dbModel';
import { ErrorMessageMode } from '/#/axios';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Db = '/cmdb/db',
  DbSchema = '/cmdb/db/schema',
  DbTable = '/cmdb/db/table',
  DbColumn = '/cmdb/db/column',
  DbSql = '/cmdb/db/sql',
}

export function getDbPageList(params: DbListParam) {
  return defHttp.get<DbListGetResultModel>({ url: Api.Db, params });
}

export function getDbInfo(id: any) {
  return defHttp.get<DbListItem>({ url: Api.Db + '/' + id });
}

export function createDb(params: DbBaseModel) {
  return defHttp.post<DbListItem>({ url: Api.Db, params });
}

export function updateDb(id: any, params: DbBaseModel) {
  return defHttp.put<DbListItem>({ url: Api.Db + '/' + id, params });
}

export function deleteDb(id: any) {
  return defHttp.delete({ url: Api.Db + '/' + id });
}

export function getSchemaNames(params: GetDbSchemaParam) {
  return defHttp.post<string[]>({ url: Api.DbSchema, params });
}

export function getTableNames(params: GetDbTableParam) {
  return defHttp.post<TableItem[]>({ url: Api.DbTable, params });
}

export function getColumns(params: GetDbColumnParam) {
  return defHttp.post<ColumnItem[]>({ url: Api.DbColumn, params });
}

export function executeSql(params: DbExecuteSqlParam, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<object[]>(
    { url: Api.DbSql, params },
    {
      errorMessageMode: mode,
    },
  );
}
