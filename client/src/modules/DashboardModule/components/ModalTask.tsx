import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import MenuActions from "./MenuActions";
import {
  useGetTaskInfoQuery,
  useSaveTaskInfoMutation,
} from "../../../redux/task/reducer";
import _ from "lodash";
import Attachments from "./Attachments";
import { Task } from "../../../types/models";

const ModalTask = () => {
  const [form] = Form.useForm<Pick<Task, "name" | "description">>();
  const navigate = useNavigate();
  const { taskId } = useParams();

  const { data, isSuccess, isError, isFetching } = useGetTaskInfoQuery(
    { taskId: taskId },
    {
      skip: !taskId,
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
      await save({ body, taskId: taskId });
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
            <Button loading={isLoadingSaveTask}>
              {isLoadingSaveTask ? "идет сохранение..." : "Закрыть окно"}
            </Button>
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
            <Space direction="vertical">
              <p>Дата создания: {data.date_start}</p>
            </Space>
            {/* <Space size={[5, 0]}>
              <Typography.Text>дата создания:</Typography.Text>
              <Typography.Text>{data.date_start}</Typography.Text>
            </Space> */}
            <Row>
              <Col span={16}>
                <Attachments taskId={taskId} />
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
