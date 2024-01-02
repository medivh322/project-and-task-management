import { FC } from "react";
import { useAppSelector } from "../redux/store";
import { useParams } from "react-router-dom";
import { useCheckAccessRoleQuery } from "../redux/common/reducer";
import { selectCommon } from "../redux/common/selectors";

const CheckRolesWrapper: FC<{ children?: JSX.Element; accessRole: string }> = ({
  children,
  accessRole,
}) => {
  const { userId } = useAppSelector(selectCommon);
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
