import { Card, Col, Flex, List, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import AddTask from "./popovers/AddTask";
import SettingsCategory from "./popovers/SettingsCategory";
import { FC } from "react";
import { Category } from "../../../types/models";

const CategoryTable: FC<{ category: Category }> = ({ category }) => {
  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Typography.Text>{category.name}</Typography.Text>
          <SettingsCategory categoryId={category._id} />
        </Flex>
      }
      bodyStyle={{ padding: "0 10px 10px 10px" }}
      style={{ width: 350 }}
    >
      {!!category.tasks.length && (
        <List
          itemLayout="horizontal"
          dataSource={category.tasks}
          renderItem={(item) => (
            <Link key={item._id} to={"m/" + item._id}>
              <Card
                bodyStyle={{ padding: "10px 15px" }}
                style={{ marginTop: "10px" }}
              >
                <List.Item
                  key={item._id}
                  style={{ display: "block", padding: 0 }}
                >
                  <Row>
                    <Col span={24}>
                      <List.Item.Meta
                        title={item.name}
                        description={
                          item.members.length
                            ? item.members
                            : "нет исполнителей"
                        }
                      />
                    </Col>
                    <Col span={24}>
                      статус: {item.status === "open" ? "открыто" : "закрыто"}
                    </Col>
                  </Row>
                </List.Item>
              </Card>
            </Link>
          )}
        />
      )}
      {<AddTask categoryId={category._id} />}
    </Card>
  );
};

export default CategoryTable;
