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
import { Layout, Spin } from "antd";
import ModalTask from "./modules/DashboardModule/components/ModalTask";
import SidebarMenu from "./modules/DashboardModule/components/SidebarMenu";
import { useCheckAuthUserQuery } from "./redux/sign/reducer";
import { useAppSelector } from "./redux/store";
import { selectCommon } from "./redux/common/selectors";
import SettingsProject from "./modules/DashboardModule/components/SettingsProject";
import { Content } from "antd/es/layout/layout";

const loggenInRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="dashboard/:projectId" element={<Board />}>
        <Route path="m/:taskId" element={<ModalTask />} />
        <Route path="s" element={<SettingsProject />} />
      </Route>
      <Route path="*" element={<Navigate to={"/"} />} />
    </Route>
  )
);

const noLoggenInRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to={"login"} />} />
    </>
  )
);

const App = () => {
  const api = useCheckAuthUserQuery();
  const { isLoadingFullScreen } = useAppSelector(selectCommon);

  if (api.isFetching) return <Spin spinning={api.isFetching} fullscreen />;

  return (
    <>
      <RouterProvider
        router={api.isSuccess ? loggenInRouter : noLoggenInRouter}
      />
      <Spin spinning={isLoadingFullScreen} fullscreen />
    </>
  );
};

function Home() {
  return <div>вы на главной</div>;
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

export default App;
