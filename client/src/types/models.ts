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
