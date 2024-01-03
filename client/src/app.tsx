import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Board from "./modules/DashboardModule/components/Board";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { Layout, Spin, notification } from "antd";
import ModalTask from "./modules/DashboardModule/components/ModalTask";
import SidebarMenu from "./modules/DashboardModule/components/SidebarMenu";
import { useAppSelector } from "./redux/store";
import { selectCommon } from "./redux/common/selectors";
import SettingsProject from "./modules/DashboardModule/components/SettingsProject";
import { Content } from "antd/es/layout/layout";
import { Cookies, useCookies, withCookies } from "react-cookie";
import { FC, useEffect, useMemo } from "react";
import { useCheckTokenQuery } from "./redux/common/reducer";
import { isUndefined } from "lodash";
import { useGetListProjectsQuery } from "./redux/kanban/reducer";
import CheckRolesWrapper from "./components/CheckRole";

const loggenInRouter = (
  <Route element={<Root />}>
    <Route path="/" element={<Home />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="dashboard/:projectId" element={<Board />}>
      <Route path="m/:taskId" element={<ModalTask />} />
      <Route
        path="s"
        element={
          <CheckRolesWrapper accessRole="Admin">
            <SettingsProject />
          </CheckRolesWrapper>
        }
      />
    </Route>
    <Route path="*" element={<Navigate to={"/"} />} />
  </Route>
);

const noLoggenInRouter = (
  <>
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="*" element={<Navigate to={"login"} />} />
  </>
);

const App = () => {
  const { isLoadingFullScreen } = useAppSelector(selectCommon);
  const [api, contextHolder] = notification.useNotification();

  const [token] = useCookies(["token"]);

  const { isFetching: fetchingCheckToken, isError } = useCheckTokenQuery(null, {
    skip: isUndefined(token.token),
  });

  useEffect(() => {
    if (isError) {
      api.error({
        message: "Ошибка проверки токена",
      });
    }
  }, [api, isError]);

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          !isError && !isUndefined(token.token)
            ? loggenInRouter
            : noLoggenInRouter
        )
      ),
    [isError, token.token]
  );

  if (fetchingCheckToken || isLoadingFullScreen)
    return <Spin spinning fullscreen />;

  return (
    <>
      <RouterProvider router={router} />
      {contextHolder}
    </>
  );
};

function Home() {
  const { userId } = useAppSelector(selectCommon);

  const { data: projectList = [], isFetching } = useGetListProjectsQuery(
    { userId },
    {
      skip: !userId,
    }
  );

  if (isFetching) return <Spin spinning />;

  if (!projectList.length) return <div>у вас нет проектов</div>;

  return <Navigate to={"/dashboard/" + projectList[0]._id} />;
}

function Root() {
  return (
    <Layout hasSider={true} style={{ height: "100vh" }}>
      <Layout.Sider>
        <SidebarMenu />
      </Layout.Sider>
      <Content style={{ padding: "10px" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default withCookies(App);
