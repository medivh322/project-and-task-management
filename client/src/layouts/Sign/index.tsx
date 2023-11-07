import { FC } from "react"
import { Layout } from "antd";

interface IProps {
    children: React.ReactNode
}

const SignFormLayout: FC<IProps> = ({ children }) => {
    return (
        <Layout style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "100vh"
        }}>
            <Layout
                style={{
                    flex: "none",
                    width: "400px"
                }}
            >
                {children}
            </Layout>
        </Layout>
    )
}

export default SignFormLayout;