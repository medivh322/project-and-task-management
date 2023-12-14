import { Alert, Button, Form, Input, Menu, Popover, Skeleton } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { selectKanban } from "../../../redux/kanban/selectors";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";
import {
  useAddListProjectsMutation,
  useGetListProjectsQuery,
} from "../../../redux/kanban/reducer";
import AddProjects from "./popovers/AddProject";

const SidebarMenu: FC = () => {
  const { userId } = useAppSelector(selectKanban);

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
    <>
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
    </>
  );
};

export default SidebarMenu;
