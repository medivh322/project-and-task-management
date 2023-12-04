import { UploadOutlined } from "@ant-design/icons";
import { Button, List, Menu, Popover, Typography, Upload } from "antd";
import Search from "antd/es/input/Search";
import { uploadFile } from "../../../redux/kanban/actions";
import { Navigate, useParams } from "react-router-dom";
import {
  useDeleteTaskMutation,
  useUploadFileMutation,
} from "../../../redux/task/reducer";
import { v4 } from "uuid";

const MenuActions = () => {
  const { taskId, projectId } = useParams();
  const [upload] = useUploadFileMutation();
  const [deleteTask, { isSuccess: successDeleteTask }] =
    useDeleteTaskMutation();

  if (successDeleteTask) return <Navigate to={"/dashboard/" + projectId} />;

  return (
    <Menu
      items={[
        {
          key: v4(),
          label: (
            <Popover
              content={
                <div>
                  <Upload
                    showUploadList={{
                      showRemoveIcon: false,
                    }}
                    customRequest={async ({ file }: any) => {
                      const data = await upload({ taskId, file });
                    }}
                  >
                    <Button icon={<UploadOutlined />}>загрузить файлы</Button>
                  </Upload>
                </div>
              }
              trigger={"click"}
            >
              <Typography.Text tabIndex={-1}>вложения</Typography.Text>
            </Popover>
          ),
        },
        {
          key: v4(),
          label: (
            <Popover
              content={
                <div>
                  <Search placeholder="поиск участников"></Search>
                  <List
                    dataSource={[
                      {
                        title: "emil",
                      },
                      {
                        title: "alina",
                      },
                      {
                        title: "emil",
                      },
                      {
                        title: "alina",
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <Button type="text" block style={{ textAlign: "left" }}>
                          {item.title}
                        </Button>
                      </List.Item>
                    )}
                  ></List>
                </div>
              }
              trigger={"click"}
            >
              <Typography.Text tabIndex={-1}>участники</Typography.Text>
            </Popover>
          ),
        },
        {
          key: v4(),
          label: (
            <Button onClick={() => deleteTask({ taskId })}>
              закрыть задачу
            </Button>
          ),
        },
      ]}
    />
  );
};

export default MenuActions;
