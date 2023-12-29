import { UploadOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Collapse,
  Flex,
  List,
  Menu,
  Popover,
  Spin,
  Typography,
  Upload,
} from "antd";
import Search from "antd/es/input/Search";
import { uploadFile } from "../../../redux/kanban/actions";
import { Navigate, useParams } from "react-router-dom";
import {
  useCloseTaskMutation,
  useUploadFileMutation,
} from "../../../redux/task/reducer";
import { v4 } from "uuid";
import ChangeStatus from "./ChangeStatus";
import { useMemo } from "react";
import SearchMembers from "./SearchMembers";

const MenuActions = () => {
  const { taskId, projectId } = useParams();
  const [upload, { isLoading: uploadingFile }] = useUploadFileMutation();
  const [closeTask, { isSuccess: successCloseTask }] = useCloseTaskMutation();
  const [
    deleteTask,
    { isSuccess: successDeleteTask, isLoading: deletingTask },
  ] = useCloseTaskMutation();

  const itemsActions = useMemo(() => {
    const items = [
      {
        key: v4(),
        label: "вложения",
        children: (
          <Upload
            disabled={uploadingFile}
            accept=".png, .jpeg"
            showUploadList={{
              showRemoveIcon: false,
            }}
            customRequest={async ({ file, onSuccess }: any) => {
              await upload({ taskId, file });
              onSuccess("ok");
            }}
          >
            <Button disabled={uploadingFile} icon={<UploadOutlined />}>
              загрузить файлы
            </Button>
          </Upload>
        ),
      },
      {
        key: v4(),
        label: "поиск участников",
        children: <SearchMembers />,
      },
      {
        key: v4(),
        label: "поменять статус",
        children: <ChangeStatus />,
      },
      {
        key: v4(),
        label: "закрыть задачу",
        children: (
          <Spin spinning={deletingTask}>
            <Flex justify="space-between" align="center">
              <Typography.Text>Вы уверены?</Typography.Text>
              {successCloseTask && (
                <Alert type="success" message="задача закрыта" />
              )}
              <Button onClick={() => closeTask({ taskId })}>Да</Button>
            </Flex>
          </Spin>
        ),
      },
      {
        key: v4(),
        label: "удалить задачу",
        children: (
          <Spin spinning={deletingTask}>
            <Flex justify="space-between" align="center">
              <Typography.Text>Вы уверены?</Typography.Text>
              <Button onClick={() => deleteTask({ taskId })}>Да</Button>
            </Flex>
          </Spin>
        ),
      },
    ];
    return items;
  }, [
    closeTask,
    deleteTask,
    deletingTask,
    successCloseTask,
    taskId,
    upload,
    uploadingFile,
  ]);

  if (successDeleteTask) return <Navigate to={"/dashboard/" + projectId} />;

  return <Collapse accordion items={itemsActions} />;
};

export default MenuActions;
