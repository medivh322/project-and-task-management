import { Modal, Tabs } from "antd";
import { useMemo } from "react";
import { v4 } from "uuid";
import ModalShare from "./Share";
import CloseProject from "./CloseProject";
import { useNavigate } from "react-router-dom";

const SettingsProject = () => {
  const navigate = useNavigate();
  const tabsItems = useMemo(
    () => [
      {
        label: "Закрыть проект",
        key: v4(),
        children: <CloseProject />,
      },
      {
        label: "Поделиться",
        key: v4(),
        children: <ModalShare />,
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
