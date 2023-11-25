import { Button, Flex, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";
import { LOGIN } from "../../../redux/sign/types";
import { useSignActionMutation } from "../../../redux/sign/reducer";

interface ILogin {
  login: string;
  password: string;
}

const LoginForm = () => {
  const [login, { isLoading, isSuccess }] = useSignActionMutation();

  const onFinish = async (values: ILogin) =>
    await login({ data: values, url: LOGIN });

  return (
    <Form
      labelAlign="left"
      labelCol={{ span: 6 }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<ILogin>
        label="Логин"
        name="login"
        validateTrigger="onBlur"
        rules={[{ required: true, message: "Пожалуйста, введите логин" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<ILogin>
        label="Пароль"
        name="password"
        rules={[{ required: true, message: "Пожалуйста, введите пароль" }]}
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
            Войти
          </Button>
        </Form.Item>
        <Typography.Link>
          <Link to="/register">Нет аккаунта? Зарегистрируйтесь</Link>
        </Typography.Link>
      </Flex>
    </Form>
  );
};

export default LoginForm;
