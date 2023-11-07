import { Form, Button, Input, Typography, Flex } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import SignFormLayout from "../layouts/Sign";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectSignIn } from "../redux/sign/selectors";
import { login } from "../redux/sign/actions";
import LoginForm from "../modules/SignModule/components/Login";

interface ILogin {
    login: string,
    password: string
}

const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector(selectSignIn)
    
    const onFinish = (values: ILogin) => dispatch(login({ loginData: values }))

    return (
        <SignFormLayout>
            <Typography.Title 
                level={2} 
                style={{textAlign: "center"}}
            >
                Войти
            </Typography.Title>
            <LoginForm onFinish={onFinish} isLoading={isLoading}/>
        </SignFormLayout>
    )
}

export default LoginPage;