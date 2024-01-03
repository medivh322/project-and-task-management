import { Button, Checkbox, Input, Table, Typography } from "antd";
import {
  useDeleteMembersTaskMutation,
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
  const { data: membersTask, isFetching: fetchMember } = useGetMembersTaskQuery(
    { taskId },
    { skip: !taskId }
  );
  const [deleteMembers] = useDeleteMembersTaskMutation();
  const [membersIds, setMembersIds] = useState<Key[]>([]);
  const [membersIdsForDelete, setMembersIdsForDelete] = useState<string[]>([]);

  useEffect(() => {
    if (settingMember) {
      reset();
    }
  }, [reset, settingMember]);

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
            Добавленные исполнители
          </Typography.Text>
        )}
        showHeader={false}
        dataSource={membersTask}
        pagination={false}
        columns={[
          {
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
              <Checkbox
                onChange={(e) => {
                  setMembersIdsForDelete((state) => {
                    const copy = [...state];
                    if (e.target.checked) copy.push(record._id);
                    else
                      copy.splice(
                        copy.findIndex((id) => id === record._id),
                        1
                      );
                    return copy;
                  });
                }}
              />
            ),
          },
          {
            dataIndex: "name",
          },
        ]}
      />
      {!!membersIdsForDelete.length && (
        <Button
          onClick={() =>
            deleteMembers({ taskId, members: membersIdsForDelete })
          }
        >
          удалить
        </Button>
      )}
    </div>
  );
};

export default SearchMembers;
