import { Popover, Alert, Input, Button, Form } from "antd";
import { useAddListProjectsMutation } from "../../../../redux/kanban/reducer";

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
      <Button
        block
        style={{
          marginTop: 20,
        }}
      >
        добавить проект
      </Button>
    </Popover>
  );
};

export default AddProjects;
