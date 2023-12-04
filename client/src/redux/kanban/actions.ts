import { fetchUploadFile } from "../../services/kanban.service";

interface IUploadFile {
  taskId: string | undefined;
  file: File;
}
const uploadFile = async ({ taskId, file }: IUploadFile) => {
  const result = await fetchUploadFile(taskId, file);
  return result;
};

export { uploadFile };
