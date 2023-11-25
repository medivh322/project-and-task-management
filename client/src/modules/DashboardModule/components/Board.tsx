import {
  Space,
  Card,
  Button,
  Layout,
  List,
  Popover,
  Menu,
  Typography,
} from "antd";
import { Link, Outlet, useNavigation, useParams } from "react-router-dom";
import { v4 } from "uuid";
import {
  useDeleteProjectMutation,
  useGetProjectBoardQuery,
} from "../../../redux/kanban/reducer";
const Board = () => {
  const params = useParams();
  const projectApi = useGetProjectBoardQuery(
    { projectId: params.id },
    {
      skip: !params.id,
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteProject, { isLoading: isLoadingDeleteProject }] =
    useDeleteProjectMutation();

  if (projectApi.isFetching) return <div>загрузка...</div>;

  return (
    <div>
      <Layout>
        <List
          itemLayout="horizontal"
          dataSource={[
            {
              name: "настройки",
            },
          ]}
          renderItem={(item) => {
            return (
              <Popover
                content={
                  <Menu
                    items={[
                      {
                        key: v4(),
                        label: (
                          <Popover
                            content={
                              <div>
                                {/* вы уверены? <Button onClick={() => deleteProject(  )}>да</Button> */}
                              </div>
                            }
                            trigger={"click"}
                          >
                            <Typography.Text>закрыть доску</Typography.Text>
                          </Popover>
                        ),
                        title: "закрыть доску",
                      },
                      {
                        key: v4(),
                        label: <Link to={"share"}>поделиться</Link>,
                        title: "поделиться",
                      },
                    ]}
                  />
                }
                title="настройки"
                trigger={"click"}
              >
                <Button>{item.name}</Button>
              </Popover>
            );
          }}
        />
      </Layout>
      {projectApi.data?.result !== null ? (
        <div>
          <Space size={35} align="start">
            {projectApi.data?.result.map((category: any) => (
              <Card
                key={category._id}
                title={category.name}
                style={{ width: 350 }}
              >
                {category.tasks &&
                  category.tasks.map((task: any) => (
                    <Link key={task._id} to={"m/" + task._id}>
                      {task.name}
                    </Link>
                  ))}
                <Button block>Добавить задачу</Button>
              </Card>
            ))}
          </Space>
          <Outlet />
        </div>
      ) : (
        <div>не найдено, добавьте категорию</div>
      )}
    </div>
  );
};

export default Board;
