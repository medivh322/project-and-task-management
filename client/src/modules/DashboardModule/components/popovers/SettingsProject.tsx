import { Popover, Button, Typography } from "antd";
import { useDeleteProjectMutation } from "../../../../redux/kanban/reducer";
import { Navigate } from "react-router-dom";
import { FC } from "react";

const SettingsProject: FC<{ paramId: string | undefined }> = ({ paramId }) => {
  const [deleteProject, { isSuccess: successDeleteProject }] =
    useDeleteProjectMutation();

  if (successDeleteProject) return <Navigate to={"/"} />;
  return (
    <Popover
      content={
        <div>
          вы уверены?{" "}
          <Button onClick={() => deleteProject({ projectId: paramId })}>
            да
          </Button>
        </div>
      }
      trigger="click"
    >
      <Typography.Text>закрыть доску</Typography.Text>
    </Popover>
  );
};

export default SettingsProject;
