import { UploadOutlined } from "@ant-design/icons";
import { Upload, Button } from "antd";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config/serverApiConfig";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import kanbanSlice from "../../../redux/kanban/reducer";
import { getKanban } from "../../../redux/kanban/selectors";
import taskApi from "../../../redux/task/reducer";

const UploadAttachment = () => {
  const { taskId } = useParams();
  const dispatch = useAppDispatch();
  const { uploadingFile } = useAppSelector(getKanban);

  return (
    <Upload
      disabled={uploadingFile}
      accept=".png, .jpeg, .docx, .doc, .pdf"
      showUploadList={{
        showRemoveIcon: false,
      }}
      action={`${API_BASE_URL}upload/${taskId}`}
      withCredentials
      onChange={(info) => {
        dispatch(
          kanbanSlice.actions.CHANGE_STATUS_UPLOAD_FILE({ status: true })
        );
        if (info.file.status === "done") {
          dispatch(taskApi.util.invalidateTags(["Attachments"]));
        }
        dispatch(
          kanbanSlice.actions.CHANGE_STATUS_UPLOAD_FILE({ status: false })
        );
      }}
    >
      <Button disabled={uploadingFile} icon={<UploadOutlined />}>
        загрузить файлы
      </Button>
    </Upload>
  );
};

export default UploadAttachment;
