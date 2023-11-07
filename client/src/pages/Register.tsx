import { Input, Flex, Button, Typography, Form } from "antd";
import { Link, useNavigate } from "react-router-dom";
import SignFormLayout from "../layouts/Sign";
import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectSignUp } from "../redux/sign/selectors";
import { signup } from "../redux/sign/actions";
import SignUpForm from "../modules/SignModule/components/SignUp";

interface ILogin {
    login: string,
    password: string
}

const RegisterPage: FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, isSuccess } = useAppSelector(selectSignUp)

    const navigate = useNavigate();

    const onFinish = (values: ILogin) => dispatch(signup({ regData: values }))

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess])

    return (
        <SignFormLayout>
            <Typography.Title
                level={2}
                style={{ textAlign: "center" }}
            >
                Регистрация
            </Typography.Title>
            <SignUpForm onFinish={onFinish} isLoading={isLoading}/>
        </SignFormLayout>
    )
}

export default RegisterPage;