import { Flex, Menu, Skeleton } from "antd";
import { useAppSelector } from "../../../redux/store";
import { selectKanban } from "../../../redux/kanban/selectors";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { EllipsisOutlined, LogoutOutlined } from "@ant-design/icons";
import { useGetListProjectsQuery } from "../../../redux/kanban/reducer";
import AddProjects from "./popovers/AddProject";
import { useLogoutMutation } from "../../../redux/sign/reducer";

const SidebarMenu: FC = () => {
  const { userId } = useAppSelector(selectKanban);
  const [logout] = useLogoutMutation();

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

  const handleClick = async () => {
    await logout();
  };

  if (isError) return <div>ошибка загрузки данных...</div>;

  if (isFetching && !currentData)
    return <Skeleton style={{ height: "200px" }} loading active />;

  return (
    <Flex vertical style={{ height: "100%", padding: "0 0 10px 0" }}>
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
      <LogoutOutlined
        style={{
          fontSize: "40px",
          color: "white",
          margin: "auto auto 0 auto",
        }}
        onClick={handleClick}
      />
    </Flex>
  );
};

export default SidebarMenu;
