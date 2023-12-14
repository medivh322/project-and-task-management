import { Space, Button, Layout } from "antd";
import { Link, Outlet, useParams } from "react-router-dom";
import { useGetProjectBoardQuery } from "../../../redux/kanban/reducer";
import CategoryTable from "./CategoryTable";
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
        <Button>
          <Link to={"s"}>Настройки</Link>
        </Button>
      </Layout>
      <Space size={35} align="start" style={{ marginRight: "400px" }}>
        {projectApi.data?.result &&
          projectApi.data?.result.map((category: any) => (
            <CategoryTable category={category} key={category._id} />
          ))}
        <AddCategory projectId={params.projectId} />
      </Space>
      <Outlet />
    </Layout.Content>
  );
};
// <Popover
//   content={
//     <Menu
//       items={[
//         {
//           key: v4(),
//           label: <SettingsProject paramId={params.projectId} />,
//           title: "закрыть доску",
//         },
//         {
//           key: v4(),
//           label: <Link to={"share"}>поделиться</Link>,
//           title: "поделиться",
//         },
//       ]}
//     />
//   }
//   trigger={"click"}
//   title="настройки"
// >
//   <Button>{item.name}</Button>
// </Popover>

export default Board;
