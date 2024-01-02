import { UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Collapse, Flex, Spin, Typography, Upload } from "antd";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  useCloseTaskMutation,
  useDeleteTaskMutation,
  useUploadFileMutation,
} from "../../../redux/task/reducer";
import { v4 } from "uuid";
import ChangeStatus from "./ChangeStatus";
import { FC, useEffect, useMemo } from "react";
import SearchMembers from "./SearchMembers";

const MenuActions: FC<{ closed: boolean }> = ({ closed }) => {
  const { taskId, projectId } = useParams();
  const navigate = useNavigate();

  const [upload, { isLoading: uploadingFile }] = useUploadFileMutation();
  const [closeTask, { isSuccess: successCloseTask }] = useCloseTaskMutation();
  const [
    deleteTask,
    { isSuccess: successDeleteTask, isLoading: deletingTask },
  ] = useDeleteTaskMutation();

  useEffect(() => {
    if (successCloseTask) navigate(0);
  }, [navigate, successCloseTask]);

  const itemsActions = useMemo(() => {
    const closeItem = {
      key: v4(),
      label: "удалить задачу",
      children: (
        <Spin spinning={deletingTask}>
          <Flex justify="space-between" align="center">
            <Typography.Text>Вы уверены?</Typography.Text>
            <Button disabled={false} onClick={() => deleteTask({ taskId })}>
              Да
            </Button>
          </Flex>
        </Spin>
      ),
    };
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
              <Button onClick={() => closeTask({ taskId })}>Да</Button>
            </Flex>
          </Spin>
        ),
      },
      closeItem,
    ];
    return !closed ? items : [closeItem];
  }, [
    closeTask,
    closed,
    deleteTask,
    deletingTask,
    taskId,
    upload,
    uploadingFile,
  ]);

  if (successDeleteTask) return <Navigate to={"/dashboard/" + projectId} />;

  return <Collapse accordion items={itemsActions} />;
};

export default MenuActions;
