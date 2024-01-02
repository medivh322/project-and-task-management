import { Button, Collapse, Flex, Spin, Typography } from "antd";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  useCloseTaskMutation,
  useDeleteTaskMutation,
} from "../../../redux/task/reducer";
import { v4 } from "uuid";
import ChangeStatus from "./ChangeStatus";
import { FC, useEffect, useMemo } from "react";
import SearchMembers from "./SearchMembers";
import { useCheckAccessRoleQuery } from "../../../redux/common/reducer";
import UploadAttachment from "./UploadAttachment";

const MenuActions: FC<{ closed: boolean }> = ({ closed }) => {
  const { taskId, projectId } = useParams();
  const navigate = useNavigate();

  const [closeTask, { isSuccess: successCloseTask }] = useCloseTaskMutation();
  const [
    deleteTask,
    { isSuccess: successDeleteTask, isLoading: deletingTask },
  ] = useDeleteTaskMutation();
  const { isError: noAccess, isFetching } = useCheckAccessRoleQuery(
    { projectId, accessRole: "Admin" },
    {
      skip: !projectId,
    }
  );

  useEffect(() => {
    if (successCloseTask) navigate(0);
  }, [navigate, successCloseTask]);

  const itemsActions = useMemo(() => {
    if (!isFetching) {
      const deleteItem = [
        {
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
        },
      ];
      const items = [
        {
          key: v4(),
          label: "вложения",
          children: <UploadAttachment />,
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
      ];
      return [...(!noAccess ? deleteItem : []), ...(!closed ? items : [])];
    }
  }, [
    closeTask,
    closed,
    deleteTask,
    deletingTask,
    isFetching,
    noAccess,
    taskId,
  ]);

  if (successDeleteTask) return <Navigate to={"/dashboard/" + projectId} />;

  return (
    <Spin spinning={isFetching}>
      <Collapse accordion items={itemsActions} />
    </Spin>
  );
};

export default MenuActions;
