import { Card, Flex, Typography } from "antd";
import { Link } from "react-router-dom";
import AddTask from "./popovers/AddTask";
import SettingsCategory from "./popovers/SettingsCategory";

const CategoryTable = ({ category }: any) => {
  return (
    <Card
      key={category._id}
      title={
        <Flex justify="space-between" align="center">
          <Typography.Text>{category.name}</Typography.Text>
          <SettingsCategory categoryId={category._id} />
        </Flex>
      }
      style={{ width: 350 }}
    >
      {category.tasks && (
        <Flex vertical>
          {category.tasks.map((task: any) => (
            <Link key={task._id} to={"m/" + task._id}>
              {task.name}
            </Link>
          ))}
        </Flex>
      )}
      {<AddTask categoryId={category._id} />}
    </Card>
  );
};

export default CategoryTable;
