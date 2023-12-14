import { FC } from "react";
import { useCheckAccessRoleQuery } from "../redux/kanban/reducer";
import { selectKanban } from "../redux/kanban/selectors";
import { useAppSelector } from "../redux/store";
import { useParams } from "react-router-dom";

const CheckRolesWrapper: FC<{ children?: JSX.Element; accessRole: string }> = ({
  children,
  accessRole,
}) => {
  const { userId } = useAppSelector(selectKanban);
  const { projectId } = useParams();
  const { isError } = useCheckAccessRoleQuery(
    { userId, projectId, accessRole },
    {
      skip: !userId && !projectId,
    }
  );

  if (isError) return null;

  return <div>{children}</div>;
};

export default CheckRolesWrapper;
