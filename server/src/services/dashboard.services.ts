import { Project } from '@models/project.model';

const getProjectInfo = async (id: string) => {
  const name = await Project.findById(id, 'name');
  return name;
};

export { getProjectInfo };
