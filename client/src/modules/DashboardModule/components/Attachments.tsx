import { List, Space, Flex, Typography, Button, Image, Spin } from "antd";
import {
  useDeleteFileMutation,
  useGetAttachmentsQuery,
} from "../../../redux/task/reducer";

const Attachments = ({ taskId }: any) => {
  const { data: attachments, isFetching: fetchingAttachments } =
    useGetAttachmentsQuery(
      {
        taskId: taskId,
      },
      {
        skip: !taskId,
      }
    );
  const [deleteFile] = useDeleteFileMutation();

  return (
    <Spin tip="загрузка..." spinning={fetchingAttachments}>
      <Typography.Text>вложения</Typography.Text>
      <List
        dataSource={attachments?.result.attachment}
        renderItem={(image) => (
          <List.Item key={image._id}>
            <Space direction="horizontal" style={{ alignItems: "start" }}>
              <Image src={image.url} width={100} height={80} />
              <div>
                <Flex vertical>
                  <Typography.Text>{image.name}</Typography.Text>
                  <Typography.Text>
                    дата загрузки: {image.date_upload}
                  </Typography.Text>
                </Flex>
                <div>
                  <Button
                    size="small"
                    onClick={() => deleteFile({ fileId: image.file_id })}
                  >
                    удалить
                  </Button>
                </div>
              </div>
            </Space>
          </List.Item>
        )}
      />
    </Spin>
  );
};

export default Attachments;
