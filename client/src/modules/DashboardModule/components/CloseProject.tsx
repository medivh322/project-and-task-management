import { Button, Spin, Typography } from "antd";
import { useDeleteProjectMutation } from "../../../redux/kanban/reducer";
import { FC } from "react";
import { useAppSelector } from "../../../redux/store";
import { selectKanban } from "../../../redux/kanban/selectors";
import { Navigate, useParams } from "react-router-dom";

const CloseProject: FC = () => {
  const { projectId } = useParams();
  const { userId } = useAppSelector(selectKanban);
  const [deleteProject, { isSuccess, isLoading }] = useDeleteProjectMutation();

  if (isSuccess) return <Navigate to={"/"} />;

  return (
    <Spin spinning={isLoading}>
      <Typography.Text>
        закрытие проекта приведет к его удалению и перманентной потере
      </Typography.Text>
      <Button
        onClick={async () => {
          await deleteProject({ projectId, userId });
        }}
      >
        Закрыть проект
      </Button>
    </Spin>
  );
};

export default CloseProject;
