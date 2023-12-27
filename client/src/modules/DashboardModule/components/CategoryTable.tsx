import { Avatar, Card, Flex, List, Typography } from "antd";
import { Link } from "react-router-dom";
import AddTask from "./popovers/AddTask";
import SettingsCategory from "./popovers/SettingsCategory";
import { FC } from "react";
import { Category } from "../../../types/models";
import { UserOutlined } from "@ant-design/icons";

const CategoryTable: FC<{ category: Category }> = ({ category }) => {
  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Typography.Text>{category.name}</Typography.Text>
          <SettingsCategory categoryId={category._id} />
        </Flex>
      }
      style={{ width: 350 }}
    >
      {!!category.tasks.length && (
        <List
          itemLayout="horizontal"
          dataSource={category.tasks}
          renderItem={(item) => (
            <Link key={item._id} to={"m/" + item._id}>
              <List.Item key={item._id}>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.name}
                  description={
                    item.members.length
                      ? item.members.map((member) => member.name)
                      : "нет исполнителей"
                  }
                />
              </List.Item>
            </Link>
          )}
        />
      )}
      {<AddTask categoryId={category._id} />}
    </Card>
  );
};

export default CategoryTable;
