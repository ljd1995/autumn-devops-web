import { BasicFetchResult, BasicPageParams } from '../../model/baseModel';

export interface DbListParam extends BasicPageParams {
  search?: string;
  db_type?: string;
  source?: string;
}

export interface DbBaseModel {
  address: string;
  port: number;
  db_type: string;
  source: string;
  db_version: string;
  db_name: string;
  admin_user: string;
  admin_password: string;
  query_user: string;
  query_password: string;
  remark: string;
}

export interface GetDbSchemaParam {
  username: string;
  password: string;
  host: string;
  port: number;
  db_type: string;
}

export interface GetDbTableParam extends GetDbSchemaParam {
  schema_name: string;
}

export interface GetDbColumnParam extends GetDbTableParam {
  table_name: string;
}

export interface DbExecuteSqlParam extends GetDbTableParam {
  sql: string;
}
export interface ColumnItem {
  name: string;
  type: string;
  default?: string;
  comment: string;
  nullable: boolean;
  autoincrement?: boolean;
}

export interface TableItem {
  table_comment?: string;
  table_engine: string;
  table_default_charset: string;
  table_name: string;
}

export interface DbListItem extends DbBaseModel {
  create_time: string;
  update_time: string;
  id: string | number;
}

export type DbListGetResultModel = BasicFetchResult<DbListItem>;
