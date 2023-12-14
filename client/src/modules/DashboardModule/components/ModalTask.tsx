import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Skeleton,
  Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import MenuActions from "./MenuActions";
import {
  useGetTaskInfoQuery,
  useSaveTaskInfoMutation,
} from "../../../redux/task/reducer";
import _ from "lodash";
import Attachments from "./Attachments";

const ModalTask = () => {
  const [form] = Form.useForm<{ name: string; description: string }>();
  const navigate = useNavigate();

  const params = useParams();
  const { data, isSuccess, isError, isFetching } = useGetTaskInfoQuery(
    { taskId: params.taskId },
    {
      skip: !params.taskId,
      refetchOnMountOrArgChange: true,
    }
  );

  const [save, { isLoading: isLoadingSaveTask }] = useSaveTaskInfoMutation();

  const closeModal = async () => {
    const body = form.getFieldsValue(["name", "description"]);
    if (
      !_.isEqual(
        _.pick({ description: data?.description, name: data?.name }, [
          "description",
          "name",
        ]),
        body
      )
    ) {
      await save({ body, taskId: params.taskId });
    }
    navigate(-1);
  };

  return (
    <Form form={form}>
      <Modal
        onOk={() => !isFetching && closeModal()}
        onCancel={() => !isFetching && closeModal()}
        open
        title={
          isSuccess ? (
            <Form.Item name="name" initialValue={data?.name}>
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
            <Form.Item name="description" initialValue={data.description}>
              <TextArea autoSize></TextArea>
            </Form.Item>
            дата создания:
            <Typography.Text>{data.date_start}</Typography.Text>
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
