import { Typography } from "antd";
import { FC } from "react";
import SignFormLayout from "../../layouts/Sign";
import SignUpForm from "./components/SignUp";

const SignUpModule: FC = () => {
  return (
    <SignFormLayout>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Регистрация
      </Typography.Title>
      <SignUpForm />
    </SignFormLayout>
  );
};

export default SignUpModule;
