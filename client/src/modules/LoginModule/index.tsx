import { Typography } from "antd";
import { FC } from "react";
import SignFormLayout from "../../layouts/Sign";
import LoginForm from "./components/Login";

const LoginModule: FC = () => {
  return (
    <SignFormLayout>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Войти
      </Typography.Title>
      <LoginForm />
    </SignFormLayout>
  );
};

export default LoginModule;
