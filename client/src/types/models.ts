export interface Model {
  test: string;
}

export interface Task {
  _id: string;
  name: string;
  description: string;
  date_end?: string;
  date_start: string;
  status: string;
  members: string[];
}

export interface Category {
  _id: string;
  name: string;
  tasks: Task[];
}

export interface ProjectListItem {
  _id: string;
  name: string;
}

export interface TableData {
  key: string;
  taskName: string;
  members: string[];
  status: string;
  [categoryName: string]: string | string[];
}

export interface Attachment {
  _id: string;
  filename: string;
  uploadDate: string;
  file_id: string;
  contentType: string;
  metadata: {
    url: string;
  };
}
