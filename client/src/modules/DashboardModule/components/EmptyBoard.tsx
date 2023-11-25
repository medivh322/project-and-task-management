import { WarningOutlined } from "@ant-design/icons";
import { Typography } from "antd";

export default function EmptyBoard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <WarningOutlined
        style={{
          fontSize: "100px",
        }}
      />
      <Typography.Text
        style={{
          fontSize: "45px",
        }}
      >
        Выберите нужный проект
      </Typography.Text>
    </div>
  );
}
