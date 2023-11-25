import { Button, Flex, Form, Input, Typography } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import { useSignActionMutation } from "../../../redux/sign/reducer";
import { SIGNUP } from "../../../redux/sign/types";

interface ILogin {
  login: string;
  password: string;
}

const SignUpForm: FC = () => {
  const [signup, { isLoading, isSuccess }] = useSignActionMutation();

  const onFinish = async (values: ILogin) =>
    await signup({ data: values, url: SIGNUP });

  return (
    <Form
      labelAlign="left"
      labelCol={{ span: 6 }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<ILogin>
        hasFeedback
        label="Логин"
        name="login"
        validateFirst
        rules={[
          { min: 3, message: "Логин должен содержить минимум 3" },
          { max: 10, message: "Логин не должен превышать 10 символов" },
          { required: true, message: "Пожалуйста, введите логин" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item<ILogin>
        label="Пароль"
        name="password"
        validateFirst
        rules={[
          { required: true, message: "Пожалуйста, введите пароль" },
          { min: 3, message: "Пароль должен содержить минимум 3" },
          {
            pattern: /^[a-zA-Z0-9]+$/,
            message: "Пароль должен содержать только латинские буквы и цифры",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Flex justify="space-between">
        <Form.Item wrapperCol={{ offset: 0, span: 6 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isSuccess}
          >
            Зарегистрироваться
          </Button>
        </Form.Item>
        <Typography.Link>
          <Link to="/login">Уже есть аккаунт? Войдите</Link>
        </Typography.Link>
      </Flex>
    </Form>
  );
};

export default SignUpForm;
