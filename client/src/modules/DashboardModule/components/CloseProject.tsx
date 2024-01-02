import { Button, Spin, Typography } from "antd";
import { useDeleteProjectMutation } from "../../../redux/kanban/reducer";
import { FC } from "react";
import { useAppSelector } from "../../../redux/store";
import { Navigate, useParams } from "react-router-dom";
import { selectCommon } from "../../../redux/common/selectors";

const CloseProject: FC = () => {
  const { projectId } = useParams();
  const { userId } = useAppSelector(selectCommon);
  const [deleteProject, { isSuccess, isLoading }] = useDeleteProjectMutation();

  if (isSuccess) return <Navigate to={"/"} />;

  return (
    <Spin spinning={isLoading}>
      <Typography.Text>
        Закрыть проект? Это приведет к его удалению
      </Typography.Text>
      <Button
        onClick={async () => {
          await deleteProject({ projectId, userId });
        }}
        style={{ marginLeft: "10px" }}
      >
        Закрыть проект
      </Button>
    </Spin>
  );
};

export default CloseProject;
