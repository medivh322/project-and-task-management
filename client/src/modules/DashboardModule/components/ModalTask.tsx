import {
  Button,
  Col,
  Flex,
  Form,
  Image,
  Input,
  List,
  Modal,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import MenuActions from "./MenuActions";
import {
  useDeleteFileMutation,
  useGetAttachmentsQuery,
  useGetTaskInfoQuery,
  useSaveTaskInfoMutation,
} from "../../../redux/task/reducer";
import _ from "lodash";
import Attachments from "./Attachments";

const ModalTask = () => {
  const [form] = Form.useForm<{ name: string; description: string }>();
  const navigate = useNavigate();

  const params = useParams();
  const {
    data = {
      result: {
        name: "",
        description: "",
      },
    },
    isSuccess,
    isError,
  } = useGetTaskInfoQuery(
    { taskId: params.taskId },
    {
      skip: !params.taskId,
      refetchOnMountOrArgChange: true,
    }
  );

  const [save, { isLoading: isLoadingSaveTask }] = useSaveTaskInfoMutation();

  const closeModal = async () => {
    const body = form.getFieldsValue(["name", "description"]);
    if (!_.isEqual(_.pick(data.result, ["description", "name"]), body)) {
      await save({ body, taskId: params.taskId });
    }
    navigate(-1);
  };

  return (
    <Form form={form}>
      <Modal
        open
        onOk={() => (!isLoadingSaveTask ? closeModal() : null)}
        onCancel={() => (!isLoadingSaveTask ? closeModal() : null)}
        title={
          isSuccess ? (
            <Form.Item name="name" initialValue={data?.result.name}>
              <Input
                style={{
                  width: 400,
                }}
              />
            </Form.Item>
          ) : !isError ? (
            <Skeleton.Input />
          ) : null
        }
        footer={
          isSuccess ? (
            <Button loading={isLoadingSaveTask}>Cancel</Button>
          ) : !isError ? (
            <Skeleton.Button />
          ) : null
        }
        width={700}
      >
        {isSuccess ? (
          <>
            описание:
            <Form.Item
              name="description"
              initialValue={data.result.description}
            >
              <TextArea autoSize></TextArea>
            </Form.Item>
            <Row>
              <Col span={16}>
                <Attachments taskId={params.taskId} />
              </Col>
              <Col span={8}>
                <MenuActions />
              </Col>
            </Row>
          </>
        ) : !isError ? (
          <Skeleton />
        ) : (
          <div>ошибка при получении данных, пожалуйста, повторите позже...</div>
        )}
      </Modal>
    </Form>
  );
};
export default ModalTask;
