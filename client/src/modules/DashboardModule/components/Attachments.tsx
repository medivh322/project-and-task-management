import { List, Space, Flex, Typography, Button, Image, Spin } from "antd";
import {
  useDeleteFileMutation,
  useGetAttachmentsQuery,
} from "../../../redux/task/reducer";
import { FileOutlined } from "@ant-design/icons";

const Attachments = ({
  taskId,
  closed,
}: {
  taskId: string | undefined;
  closed: boolean;
}) => {
  const { data: attachments, isFetching: fetchingAttachments } =
    useGetAttachmentsQuery(
      {
        taskId: taskId,
      },
      {
        skip: !taskId,
      }
    );
  const [deleteFile, { isLoading: loadingDeleteFile }] =
    useDeleteFileMutation();

  return (
    <Spin tip="загрузка..." spinning={fetchingAttachments || loadingDeleteFile}>
      <Typography.Text>вложения</Typography.Text>
      <List
        dataSource={attachments}
        renderItem={(image) => (
          <List.Item key={image._id}>
            <Space direction="horizontal" style={{ alignItems: "start" }}>
              {image.contentType === "image/png" ? (
                <Image
                  src={image.metadata.url + image._id}
                  width={100}
                  height={80}
                />
              ) : (
                <Button
                  style={{
                    width: 100,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  rel="noopener noreferrer"
                  icon={<FileOutlined style={{ fontSize: 30 }} />}
                  href={image.metadata.url + image._id}
                  target="_blank"
                />
              )}
              <div>
                <Flex vertical>
                  <Typography.Text>{image.filename}</Typography.Text>
                  <Typography.Text>
                    дата загрузки: {image.uploadDate}
                  </Typography.Text>
                </Flex>
                {!closed && (
                  <div>
                    <Button
                      size="small"
                      onClick={() => deleteFile({ fileId: image.file_id })}
                    >
                      удалить
                    </Button>
                  </div>
                )}
              </div>
            </Space>
          </List.Item>
        )}
      />
    </Spin>
  );
};

export default Attachments;
