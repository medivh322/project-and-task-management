import {
  Input,
  Table,
  Spin,
  notification,
  Typography,
  Button,
  Checkbox,
} from "antd";
import {
  useDeleteMembersProjectMutation,
  useGetMembersProjectQuery,
  useSearchMembersMutation,
  useShareMembersMutation,
} from "../../../redux/kanban/reducer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Key } from "antd/es/table/interface";

const Share = () => {
  const [api, context] = notification.useNotification({
    stack: {
      threshold: 2,
    },
  });
  const { projectId } = useParams();
  const [membersIds, setMembersIds] = useState<Key[]>([]);
  const [membersIdsForDelete, setMembersIdsForDelete] = useState<string[]>([]);

  const [search, { data: membersList, isLoading, reset }] =
    useSearchMembersMutation();
  const [share, { isSuccess: successSharing, isLoading: sharing }] =
    useShareMembersMutation();
  const { data: membersProject, isLoading: fetchMember } =
    useGetMembersProjectQuery({ projectId }, { skip: !projectId });
  const [deleteMembers] = useDeleteMembersProjectMutation();
  useEffect(() => {
    if (successSharing) reset();
  }, [reset, successSharing]);

  const handleShare = async () => {
    if (!membersIds.length)
      return api.open({
        message: "ошибка",
        description: "выберите необходимых пользователей",
      });
    await share({ membersArray: membersIds, projectId });
  };

  return (
    <>
      {context}
      <Spin spinning={sharing || fetchMember}>
        <Input.Search
          loading={isLoading}
          placeholder="input search text"
          onSearch={(value: any) => search({ query: value, projectId })}
          enterButton
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
        <Button type="primary" onClick={handleShare} disabled={sharing}>
          Поделиться
        </Button>

        {membersProject?.length && (
          <>
            <Table
              title={() => (
                <Typography.Text
                  style={{ textAlign: "center", display: "block" }}
                >
                  Добавленные пользователи
                </Typography.Text>
              )}
              showHeader={false}
              dataSource={membersProject}
              pagination={false}
              columns={[
                {
                  dataIndex: "action",
                  key: "action",
                  render: (_, record) =>
                    record.role !== "Администратор" ? (
                      <Checkbox
                        onChange={(e) => {
                          setMembersIdsForDelete((state) => {
                            const copy = [...state];
                            if (e.target.checked) copy.push(record.key);
                            else
                              copy.splice(
                                copy.findIndex((id) => id === record.key),
                                1
                              );
                            return copy;
                          });
                        }}
                      />
                    ) : null,
                },
                {
                  dataIndex: "name",
                },
                {
                  dataIndex: "role",
                },
              ]}
            />
            {!!membersIdsForDelete.length && (
              <Button
                onClick={() =>
                  deleteMembers({ projectId, members: membersIdsForDelete })
                }
              >
                удалить
              </Button>
            )}
          </>
        )}
      </Spin>
    </>
  );
};

export default Share;
