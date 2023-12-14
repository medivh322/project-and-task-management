import { Input, Table, Spin, notification, Typography, Button } from "antd";
import {
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

  const [search, { data: membersList, isLoading, reset }] =
    useSearchMembersMutation();
  const [share, { isSuccess: successSharing, isLoading: sharing }] =
    useShareMembersMutation();
  const { data: membersProject, isLoading: fetchMember } =
    useGetMembersProjectQuery({ projectId }, { skip: !projectId });
  useEffect(() => {
    reset();
  }, [successSharing]);

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
                dataIndex: "name",
              },
              {
                dataIndex: "role",
              },
            ]}
          />
        )}
      </Spin>
    </>
  );
};

export default Share;
