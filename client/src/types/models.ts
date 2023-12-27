export interface Model {
  test: string;
}

export interface Task {
  _id: string;
  name: string;
  description: string;
  members: {
    name: string;
  }[];
}

export interface Category {
  _id: string;
  name: string;
  tasks: Task[];
}
