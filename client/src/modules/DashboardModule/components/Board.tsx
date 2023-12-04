import { Space, Button, Layout, List, Menu, Popover } from "antd";
import { Link, Outlet, useParams } from "react-router-dom";
import { v4 } from "uuid";
import { useGetProjectBoardQuery } from "../../../redux/kanban/reducer";
import CategoryTable from "./CategoryTable";
import SettingsProject from "./popovers/SettingsProject";
import AddCategory from "./popovers/AddCategory";
const Board = () => {
  const params = useParams();
  const projectApi = useGetProjectBoardQuery(
    { projectId: params.projectId },
    {
      skip: !params.projectId,
      refetchOnMountOrArgChange: true,
    }
  );

  if (projectApi.isFetching) return <div>загрузка...</div>;

  return (
    <Layout.Content style={{ overflowX: "auto" }}>
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
                        label: <SettingsProject paramId={params.projectId} />,
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
              >
                <Button>{item.name}</Button>
              </Popover>
            );
          }}
        />
      </Layout>
      {projectApi.data?.result !== null ? (
        <div>
          <Space size={35} align="start" style={{ marginRight: "400px" }}>
            {projectApi.data?.result.map((category: any) => (
              <CategoryTable category={category} key={category._id} />
            ))}
            <AddCategory projectId={params.projectId} />
          </Space>
          <Outlet />
        </div>
      ) : (
        <div>не найдено, добавьте категорию</div>
      )}
    </Layout.Content>
  );
};

export default Board;
