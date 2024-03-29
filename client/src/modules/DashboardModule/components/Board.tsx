import { Space, Button, Layout } from "antd";
import { Link, Outlet, useParams } from "react-router-dom";
import { useGetProjectBoardQuery } from "../../../redux/kanban/reducer";
import AddCategory from "./popovers/AddCategory";
import CategoryTable from "./CategoryTable";
import { useAppSelector } from "../../../redux/store";
import { getKanban } from "../../../redux/kanban/selectors";
import CheckRolesWrapper from "../../../components/CheckRole";

const Board = () => {
  const params = useParams();
  const { boardData, curIdBoard } = useAppSelector(getKanban);
  const { isFetching: loading } = useGetProjectBoardQuery(
    { projectId: params.projectId },
    {
      skip: !params.projectId || curIdBoard === params.projectId,
      refetchOnMountOrArgChange: true,
    }
  );

  if (loading) return <div>загрузка...</div>;

  return (
    <Layout.Content style={{ overflow: "scroll", height: "100%" }}>
      <CheckRolesWrapper accessRole="Admin">
        <Space style={{ marginBottom: "10px" }}>
          <Link to={"s"}>
            <Button>Настройки</Button>
          </Link>
        </Space>
      </CheckRolesWrapper>
      <Layout>
        <Space size={35} align="start" style={{ marginRight: "400px" }}>
          {!!boardData?.length &&
            boardData.map((category) => (
              <CategoryTable category={category} key={category._id} />
            ))}
          <AddCategory projectId={params.projectId} />
        </Space>
      </Layout>
      <Outlet />
    </Layout.Content>
  );
};

export default Board;
