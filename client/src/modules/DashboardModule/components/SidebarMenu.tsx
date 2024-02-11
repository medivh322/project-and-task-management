import { Button, Flex, Menu, Skeleton, Typography } from "antd";
import { useAppSelector } from "../../../redux/store";

import { ItemType } from "antd/es/menu/hooks/useItems";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useGetListProjectsQuery } from "../../../redux/kanban/reducer";
import AddProjects from "./popovers/AddProject";
import { selectCommon } from "../../../redux/common/selectors";
import Logout from "./Logout";

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
      {projectsList.length ? (
        <>
          <Typography.Text style={{ color: "white", padding: "10px 15px" }}>
            Список проектов:
          </Typography.Text>
          <Menu
            onClick={handleClickMenuProjects}
            mode="inline"
            style={{ height: "100%", borderRight: 0 }}
            items={projectsList.map(
              (project: any): ItemType => ({
                key: project._id,
                title: project.name,
                label: project.name,
                disabled: isFetching,
              })
            )}
          />
        </>
      ) : (
        <Typography.Text style={{ color: "white", padding: "10px 15px" }}>
          список проектов пуст
        </Typography.Text>
      )}
      <AddProjects userId={userId} />
      <Button type="text" style={{ height: "auto" }}>
        <Flex align="center" justify="start">
          <Logout />
          <Typography.Text style={{ color: "white", marginLeft: "10px" }}>
            Выход
          </Typography.Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default SidebarMenu;
