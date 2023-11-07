import { Layout } from "antd";
import { FC } from "react";
import AppLayout from "../../layouts/App";
import SidebarMenu from "./components/SidebarMenu";
import Kanban from "../KanbanModule";

const DashboardModule: FC = () => {
    return (
        <AppLayout >
            <Layout hasSider={true}>
                <SidebarMenu />
                <Kanban />
            </Layout>
        </AppLayout>
    )
}

export default DashboardModule;