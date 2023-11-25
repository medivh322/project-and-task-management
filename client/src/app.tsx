import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  defer,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Board from "./modules/DashboardModule/components/Board";
import { useMemo } from "react";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { getTaskInfo } from "./redux/kanban/actions";
import { Layout } from "antd";
import AppLayout from "./layouts/App";
import ModalAddTask from "./modules/DashboardModule/components/ModalAddTask";
import SidebarMenu from "./modules/DashboardModule/components/SidebarMenu";
import Sider from "antd/es/layout/Sider";
import { useCheckAuthUserQuery } from "./redux/sign/reducer";

const loggenInRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="dashboard/:id" element={<Board />}>
        <Route
          path="m/:idm"
          loader={async ({ params }) => {
            const data = getTaskInfo(params.idm);
            return defer({
              data,
            });
          }}
          element={<ModalAddTask />}
        />
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
  return (
    <AppLayout>
      <Layout hasSider={true}>
        <Sider>
          <SidebarMenu />
        </Sider>
        <Outlet />
      </Layout>
    </AppLayout>
  );
}

export default App;
