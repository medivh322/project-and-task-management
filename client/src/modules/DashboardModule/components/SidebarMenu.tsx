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

const SidebarMenu: FC = () => {
  const { userId } = useAppSelector(selectKanban);

  const navigate = useNavigate();

  const {
    data: projectsList = [],
    isFetching,
    isError,
    currentData,
    isSuccess,
  } = useGetListProjectsQuery(
    { userId },
    {
      skip: !userId,
    }
  );
  const [
    add,
    {
      data: dataCreateProject,
      isLoading: loadingCreateProejct,
      isError: failedToCreateProject,
      isSuccess: projectSuccesffullyCreated,
    },
  ] = useAddListProjectsMutation();

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
      <Popover
        overlayStyle={{ width: "300px" }}
        content={
          <Form
            onFinish={(value) => add({ userId, name: value.title })}
            autoComplete="off"
          >
            {projectSuccesffullyCreated && (
              <Alert
                type="success"
                showIcon
                closable
                message={dataCreateProject?.message}
              />
            )}
            {failedToCreateProject && (
              <Alert
                type="error"
                showIcon
                closable
                message="Ошибка"
                description={dataCreateProject?.message}
              />
            )}
            <Form.Item
              rules={[{ required: true, message: "заполните поле" }]}
              name="title"
            >
              <Input placeholder="название проекта" />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                loading={loadingCreateProejct}
              >
                создать
              </Button>
            </Form.Item>
          </Form>
        }
        title="Создать проект"
        trigger={"click"}
      >
        <Button
          block
          style={{
            marginTop: 20,
          }}
        >
          добавить проект
        </Button>
      </Popover>
    </>
  );
};

export default SidebarMenu;
