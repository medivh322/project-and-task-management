import { Modal, Spin, Tabs } from "antd";
import { useMemo } from "react";
import { v4 } from "uuid";
import ModalShare from "./Share";
import CloseProject from "./CloseProject";
import { useNavigate, useParams } from "react-router-dom";
import { useCheckAccessRoleQuery } from "../../../redux/common/reducer";

const SettingsProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const { isError, isFetching } = useCheckAccessRoleQuery(
    { projectId, accessRole: "Admin" },
    {
      skip: !projectId,
    }
  );

  const tabsItems = useMemo(() => {
    if (!isFetching) {
      const items = [
        {
          label: "Поделиться",
          key: v4(),
          children: <ModalShare />,
        },
      ];
      if (!isError)
        items.push({
          label: "Закрыть проект",
          key: v4(),
          children: <CloseProject />,
        });
      return items;
    }
  }, [isError, isFetching]);
  return (
    <Modal
      open
      title={"Настройки проекта"}
      width={"50vw"}
      footer={null}
      onCancel={() => navigate(-1)}
    >
      <Spin spinning={isFetching}>
        <Tabs defaultActiveKey="1" tabPosition={"left"} items={tabsItems} />
      </Spin>
    </Modal>
  );
};

export default SettingsProject;
