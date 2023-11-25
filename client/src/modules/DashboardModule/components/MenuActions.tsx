import { UploadOutlined } from "@ant-design/icons";
import { Button, List, Menu, Popover, Typography, Upload } from "antd";
import Search from "antd/es/input/Search";
import { uploadFile } from "../../../redux/kanban/actions";
import { useParams } from "react-router-dom";

const MenuActions = () => {
  const { idm } = useParams();

  return (
    <Menu
      items={[
        {
          key: "24dgnebf2",
          label: (
            <Popover
              content={
                <div>
                  <Upload
                    showUploadList={{
                      showRemoveIcon: false,
                    }}
                    customRequest={async ({
                      file,
                      onSuccess,
                      onError,
                    }: any) => {
                      const { success } = await uploadFile({
                        idm,
                        file,
                      });

                      success ? onSuccess() : onError();
                    }}
                  >
                    <Button icon={<UploadOutlined />}>загрузить файлы</Button>
                  </Upload>
                </div>
              }
              trigger={"click"}
            >
              <Typography.Text tabIndex={-1}>вложения</Typography.Text>
            </Popover>
          ),
        },
        {
          key: "24dgvcxvdfsdfnebf2",
          label: (
            <Popover
              content={
                <div>
                  <Search placeholder="поиск участников"></Search>
                  <List
                    dataSource={[
                      {
                        title: "emil",
                      },
                      {
                        title: "alina",
                      },
                      {
                        title: "emil",
                      },
                      {
                        title: "alina",
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <Button type="text" block style={{ textAlign: "left" }}>
                          {item.title}
                        </Button>
                      </List.Item>
                    )}
                  ></List>
                </div>
              }
              trigger={"click"}
            >
              <Typography.Text tabIndex={-1}>участники</Typography.Text>
            </Popover>
          ),
        },
      ]}
    />
  );
};

export default MenuActions;
