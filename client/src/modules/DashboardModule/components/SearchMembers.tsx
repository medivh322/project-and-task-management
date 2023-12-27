import { List, Button, Input, Table, notification, Typography } from "antd";
import { useSearchMembersMutation } from "../../../redux/kanban/reducer";
import {
  useGetMembersTaskQuery,
  useSearchMembersTaskMutation,
  useSetMemberTaskMutation,
} from "../../../redux/task/reducer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Key } from "antd/es/table/interface";

const SearchMembers = () => {
  const { taskId, projectId } = useParams();
  const [search, { isLoading, data: membersList, reset }] =
    useSearchMembersTaskMutation();
  const [set, { isSuccess: successSetMember, isLoading: settingMember }] =
    useSetMemberTaskMutation();
  const { data: membersTask, isLoading: fetchMember } = useGetMembersTaskQuery(
    { taskId },
    { skip: !taskId }
  );
  const [membersIds, setMembersIds] = useState<Key[]>([]);

  useEffect(() => {
    reset();
  }, [successSetMember]);

  return (
    <div>
      <Input.Search
        placeholder="поиск участников"
        onSearch={(query) => search({ projectId, query })}
      />
      <Table
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys) => setMembersIds(selectedRowKeys),
        }}
        loading={isLoading}
        showHeader={false}
        dataSource={membersList}
        pagination={false}
        columns={[
          {
            dataIndex: "name",
          },
        ]}
      />
      <Button
        type="primary"
        onClick={() =>
          membersIds.length && set({ membersArray: membersIds, taskId })
        }
        disabled={settingMember || !membersIds.length}
      >
        Установить
      </Button>
      <Table
        loading={fetchMember}
        title={() => (
          <Typography.Text style={{ textAlign: "center", display: "block" }}>
            Добавленные пользователи
          </Typography.Text>
        )}
        showHeader={false}
        dataSource={membersTask}
        pagination={false}
        columns={[
          {
            dataIndex: "name",
          },
        ]}
      />
    </div>
  );
};

export default SearchMembers;
