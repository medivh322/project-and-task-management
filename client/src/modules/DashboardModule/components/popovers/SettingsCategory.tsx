import { DashOutlined } from "@ant-design/icons";
import { Popover, Button, Menu } from "antd";
import { FC } from "react";
import { v4 } from "uuid";
import { useDeleteCategoryMutation } from "../../../../redux/kanban/reducer";

const SettingsCategory: FC<{ categoryId: string | undefined }> = ({
  categoryId,
}) => {
  const [deleteCategory] = useDeleteCategoryMutation();
  return (
    <Popover
      content={
        <Menu
          items={[
            {
              key: v4(),
              label: (
                <Popover
                  trigger={"click"}
                  content={
                    <div>
                      вы уверены?{" "}
                      <Button onClick={() => deleteCategory({ categoryId })}>
                        да
                      </Button>
                    </div>
                  }
                >
                  закрыть статус
                </Popover>
              ),
              title: "удалить",
            },
          ]}
        />
      }
      trigger="click"
    >
      <Button
        type="text"
        icon={<DashOutlined style={{ fontSize: "20px" }} />}
      />
    </Popover>
  );
};

export default SettingsCategory;
