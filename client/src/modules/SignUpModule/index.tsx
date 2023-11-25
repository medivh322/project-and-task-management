import { Typography } from "antd";
import { FC, useEffect } from "react";
import SignFormLayout from "../../layouts/Sign";
import { useAppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./components/SignUp";
import { SIGNUP } from "../../redux/sign/types";
import { useSignActionMutation } from "../../redux/sign/reducer";

interface ILogin {
  login: string;
  password: string;
}

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
