export interface WikiPageBaseModel {
  name: string;
  content: string;
  secret: string;
  remark: string;
  wiki_category_id: number;
}

export interface WikiPageListItem extends WikiPageBaseModel {
  id: number;
  create_time: string;
  update_time: string;
  create_user: string;
  update_user: string;
}
