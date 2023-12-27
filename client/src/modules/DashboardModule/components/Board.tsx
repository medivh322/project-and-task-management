import { Space, Button, Layout } from "antd";
import { Link, Outlet, useParams } from "react-router-dom";
import { useGetProjectBoardQuery } from "../../../redux/kanban/reducer";
import AddCategory from "./popovers/AddCategory";
import CategoryTable from "./CategoryTable";
const Board = () => {
  const params = useParams();
  const { data: categories, isFetching: loading } = useGetProjectBoardQuery(
    { projectId: params.projectId },
    {
      skip: !params.projectId,
      refetchOnMountOrArgChange: true,
    }
  );

  if (loading) return <div>загрузка...</div>;

  // console.log(data);

  return (
    <Layout.Content style={{ overflowX: "auto" }}>
      <Space>
        <Button>
          <Link to={"s"}>Настройки</Link>
        </Button>
      </Space>
      <Layout style={{ marginTop: "10px" }}>
        <Space size={35} align="start" style={{ marginRight: "400px" }}>
          {!!categories?.length &&
            categories.map((category) => (
              <CategoryTable category={category} key={category._id} />
            ))}
          <AddCategory projectId={params.projectId} />
        </Space>
      </Layout>
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
