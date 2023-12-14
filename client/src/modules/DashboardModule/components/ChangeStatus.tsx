import { Popover, Spin, Table, Typography } from "antd";
import { useParams } from "react-router-dom";
import {
  useChangeStatusMutation,
  useGetStatusesQuery,
} from "../../../redux/task/reducer";

const ChangeStatus = () => {
  const { projectId, taskId } = useParams();
  const { data, isFetching: gettingStatuses } = useGetStatusesQuery(
    { projectId, taskId },
    { skip: !projectId && !taskId }
  );
  const [change, { isLoading: changing }] = useChangeStatusMutation();
  return (
    <Spin spinning={changing || gettingStatuses}>
      <Table
        rowSelection={{
          selectedRowKeys: data?.statuses
            .filter((item) => item.selected)
            .map((item) => item.key),
          type: "radio",
          onChange: (selectedRowKeys) =>
            change({ categoryId: selectedRowKeys[0], taskId }),
        }}
        showHeader={false}
        dataSource={data?.statuses}
        pagination={false}
        columns={[
          {
            dataIndex: "name",
          },
        ]}
      />
    </Spin>
  );
};

export default ChangeStatus;
