import {
  fetchTaskInfo,
  fetchUploadFile,
  postCreateTask,
} from "../../services/kanban.service";

const getTaskInfo = async (id: string | undefined) => {
  const result: any = await fetchTaskInfo(id);
  return result;
};

interface IUploadFile {
  idm: string | undefined;
  file: File;
}
const uploadFile = async ({ idm, file }: IUploadFile) => {
  const result = await fetchUploadFile(idm, file);
  return result;
};

const createTask = async ({
  id_user,
  name,
}: {
  id_user: string;
  name: string;
}) => {
  const result = await postCreateTask({
    id_user,
    name,
  });

  return result;
};

export { getTaskInfo, uploadFile, createTask };
