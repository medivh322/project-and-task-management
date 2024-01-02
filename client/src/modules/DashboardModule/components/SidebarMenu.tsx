import { Flex, Menu, Skeleton, Typography } from "antd";
import { useAppSelector } from "../../../redux/store";

import { ItemType } from "antd/es/menu/hooks/useItems";
import { FC } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";
import { useGetListProjectsQuery } from "../../../redux/kanban/reducer";
import AddProjects from "./popovers/AddProject";
import { selectCommon } from "../../../redux/common/selectors";
import Logout from "./Logout";
import { getKanban } from "../../../redux/kanban/selectors";

const SidebarMenu: FC = () => {
  const { userId } = useAppSelector(selectCommon);

  const navigate = useNavigate();

  const {
    data: projectsList = [],
    isFetching,
    isError,
    currentData,
  } = useGetListProjectsQuery(
    { userId },
    {
      skip: !userId,
    }
  );

  const handleClickMenuProjects = (e: any) => {
    navigate(`/dashboard/${e.key}`);
  };

  if (isError) return <div>ошибка загрузки данных...</div>;

  if (isFetching && !currentData)
    return <Skeleton style={{ height: "200px" }} loading active />;

  return (
    <Flex vertical style={{ height: "100%", padding: "0 0 10px 0" }}>
      <Typography.Text style={{ color: "white" }}>
        Список проектов:
      </Typography.Text>
      {projectsList.length ? (
        <Menu
          onClick={handleClickMenuProjects}
          mode="inline"
          overflowedIndicator={<EllipsisOutlined />}
          items={projectsList.map(
            (project: any): ItemType => ({
              key: project._id,
              title: project.name,
              label: project.name,
              disabled: isFetching,
            })
          )}
        />
      ) : (
        <div>список проектов пуст</div>
      )}
      <AddProjects userId={userId} />
      <Logout />
    </Flex>
  );
};

export default SidebarMenu;
