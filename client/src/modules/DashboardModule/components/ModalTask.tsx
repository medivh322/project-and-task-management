import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Skeleton,
  Space,
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
import { Task } from "../../../types/models";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";
import { isTaskOverdue } from "../../../helper";

dayjs.extend(utc);

const ModalTask = () => {
  const [form] =
    Form.useForm<
      Pick<Task, "name" | "description" | "date_end" | "date_start">
    >();
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

  const closeModal = async (closed: boolean) => {
    const pickParameters = ["description", "name", "date_end"];
    const body = form.getFieldsValue(pickParameters);
    body.date_end = body?.date_end[1] ? dayjs(body?.date_end[1]) : null;
    if (
      !_.isEqual(
        _.pick(
          {
            description: data?.description,
            name: data?.name,
            date_end:
              typeof data?.date_end !== "undefined"
                ? dayjs(data?.date_end)
                : null,
          },
          pickParameters
        ),
        body
      ) &&
      !closed
    ) {
      await save({ body, taskId: taskId });
    }
    navigate(-1);
  };

  const isOverdue = useMemo(
    () => isTaskOverdue(data?.date_start),
    [data?.date_start]
  );

  const closed = data?.status === "close";

  return (
    <Form form={form} disabled={closed}>
      <Modal
        onOk={() => !isFetching && closeModal(closed)}
        onCancel={() => !isFetching && closeModal(closed)}
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
            <Space align="center" style={{ marginBottom: "20px" }}>
              <p style={{ margin: 0 }}>Дата создания/завершения</p>
              <Form.Item
                name="date_end"
                style={{ margin: 0 }}
                initialValue={[
                  dayjs(data.date_start),
                  typeof data.date_end !== "undefined"
                    ? dayjs(data.date_end)
                    : null,
                ]}
              >
                <DatePicker.RangePicker
                  disabled={[true, closed]}
                  allowEmpty={[false, true]}
                />
              </Form.Item>
            </Space>
            {isOverdue && (
              <Alert showIcon type="warning" message="Задача просрочена" />
            )}
            <Row style={{ marginTop: 20 }}>
              <Col span={16}>
                <Attachments taskId={taskId} closed={closed} />
              </Col>
              <Col span={8}>
                <MenuActions closed={closed} />
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
