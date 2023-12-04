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
import { useMemo } from "react";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { Layout, Spin } from "antd";
import AppLayout from "./layouts/App";
import ModalTask from "./modules/DashboardModule/components/ModalTask";
import SidebarMenu from "./modules/DashboardModule/components/SidebarMenu";
import { useCheckAuthUserQuery } from "./redux/sign/reducer";
import { useAppSelector } from "./redux/store";
import { selectCommon } from "./redux/common/selectors";

const loggenInRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="dashboard/:projectId" element={<Board />}>
        <Route path="m/:taskId" element={<ModalTask />} />
        <Route path="share" element={<div>поделиться</div>} />
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

  const router = useMemo(() => {
    return api.data?.success ? loggenInRouter : noLoggenInRouter;
  }, [api]);

  if (api.fulfilledTimeStamp) {
    return <RouterProvider router={router} />;
  }

  return null;
};

function Home() {
  return <div>вы на главной</div>;
}

function Root() {
  const { isLoadingFullScreen } = useAppSelector(selectCommon);
  return (
    <>
      <AppLayout>
        <Layout hasSider={true}>
          <Layout.Sider>
            <SidebarMenu />
          </Layout.Sider>
          <Outlet />
        </Layout>
      </AppLayout>
      <Spin spinning={isLoadingFullScreen} fullscreen />
    </>
  );
}

export default App;
