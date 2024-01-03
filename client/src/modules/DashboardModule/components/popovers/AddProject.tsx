import { Popover, Alert, Input, Button, Form, Flex, Typography } from "antd";
import { useAddListProjectsMutation } from "../../../../redux/kanban/reducer";
import { AppstoreAddOutlined } from "@ant-design/icons";

const AddProjects: React.FC<{ userId: string | null }> = ({ userId }) => {
  const [
    add,
    {
      data: dataCreateProject,
      isLoading: loadingCreateProejct,
      isError: failedToCreateProject,
      isSuccess: projectSuccesffullyCreated,
    },
  ] = useAddListProjectsMutation();

  return (
    <Popover
      overlayStyle={{ width: "300px" }}
      fresh
      content={
        <Form
          onFinish={(value) => add({ userId, name: value.title })}
          autoComplete="off"
        >
          {projectSuccesffullyCreated && (
            <Alert
              type="success"
              showIcon
              closable
              message={dataCreateProject?.message}
            />
          )}
          {failedToCreateProject && (
            <Alert
              type="error"
              showIcon
              closable
              message="Ошибка"
              description={dataCreateProject?.message}
            />
          )}
          <Form.Item
            rules={[{ required: true, message: "заполните поле" }]}
            name="title"
          >
            <Input placeholder="название проекта" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={loadingCreateProejct}
            >
              создать
            </Button>
          </Form.Item>
        </Form>
      }
      title="Создать проект"
      trigger={"click"}
    >
      <Button type="text" style={{ height: "auto" }}>
        <Flex align="center" justify="start">
          <AppstoreAddOutlined
            style={{
              fontSize: "40px",
              color: "white",
            }}
          />
          <Typography.Text style={{ color: "white", marginLeft: "10px" }}>
            Добавить проект
          </Typography.Text>
        </Flex>
      </Button>
    </Popover>
  );
};

export default AddProjects;
