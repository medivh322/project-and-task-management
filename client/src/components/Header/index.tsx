import { LogoutOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useLogoutMutation } from "../../redux/sign/reducer";

const HeaderApp = () => {
  const [logout] = useLogoutMutation();
  const handleClick = async () => {
    await logout();
  };
  return (
    <Header style={{ display: "flex" }}>
      <LogoutOutlined
        style={{
          fontSize: "40px",
          color: "white",
          marginLeft: "auto",
        }}
        onClick={handleClick}
      />
    </Header>
  );
};

export default HeaderApp;
