import { Modal, Spin, Tabs } from "antd";
import { useMemo } from "react";
import { v4 } from "uuid";
import ModalShare from "./Share";
import CloseProject from "./CloseProject";
import { useNavigate, useParams } from "react-router-dom";

const SettingsProject = () => {
  const navigate = useNavigate();

  const tabsItems = useMemo(
    () => [
      {
        label: "Поделиться",
        key: v4(),
        children: <ModalShare />,
      },
      {
        label: "Закрыть проект",
        key: v4(),
        children: <CloseProject />,
      },
    ],
    []
  );
  return (
    <Modal
      open
      title={"Настройки проекта"}
      width={"50vw"}
      footer={null}
      onCancel={() => navigate(-1)}
    >
      <Tabs defaultActiveKey="1" tabPosition={"left"} items={tabsItems} />
    </Modal>
  );
};

export default SettingsProject;
