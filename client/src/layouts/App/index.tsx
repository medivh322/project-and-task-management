import { FC } from "react"
import { Layout } from "antd";
import HeaderApp from "../../components/Header";

interface IProps {
    children: React.ReactNode
}

const AppLayout: FC<IProps> = ({ children }) => {
    return (
        <Layout style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto 1fr",
            height: "100vh"
        }}>
            <HeaderApp />
            {children}
        </Layout>
    )
}

export default AppLayout;