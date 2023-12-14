import { Popover, Input, Button, Form } from "antd";
import { useAddTaskMutation } from "../../../../redux/kanban/reducer";
import { useParams } from "react-router-dom";

const AddTask = ({ categoryId }: any) => {
  const { projectId } = useParams();
  const [addTask, { isLoading: loadingAddTask }] = useAddTaskMutation();

  return (
    <Popover
      content={
        <Form
          onFinish={(values: any) =>
            addTask({
              categoryId: categoryId,
              name: values.title,
              projectId,
            })
          }
        >
          <Form.Item
            rules={[{ required: true, message: "заполните поле" }]}
            name="title"
          >
            <Input placeholder="название проекта" />
          </Form.Item>
          <Form.Item>
            <Button loading={loadingAddTask} htmlType="submit">
              Создать
            </Button>
          </Form.Item>
        </Form>
      }
      trigger="click"
    >
      <Button block>Добавить задачу</Button>
    </Popover>
  );
};

export default AddTask;
