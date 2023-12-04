import { Button, Form, Input, Popover } from "antd";
import { useAddCategoryMutation } from "../../../../redux/kanban/reducer";
import { FC } from "react";

const AddCategory: FC<{ projectId: string | undefined }> = ({ projectId }) => {
  const [addCategory, { isLoading }] = useAddCategoryMutation();
  return (
    <Popover
      content={
        <Form
          onFinish={(values: any) =>
            addCategory({
              name: values.title,
              projectId,
            })
          }
        >
          <Form.Item
            rules={[{ required: true, message: "заполните поле" }]}
            name="title"
          >
            <Input placeholder="название категории" />
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} htmlType="submit">
              создать
            </Button>
          </Form.Item>
        </Form>
      }
    >
      <Button>добавить категорию</Button>
    </Popover>
  );
};
export default AddCategory;
