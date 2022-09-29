export interface WikiCategoryDataModel {
  id: number;
  create_time: string;
  update_time: string;
  name: string;
  remark: string;
  parent_id: number;
  children: WikiCategoryDataModel[];
  key: number;
  title: string;
}

export interface WikiCategoryChildrenParam {
  name: string;
  remark: string;
  parent_id: number;
  zone_id: number | string;
}
