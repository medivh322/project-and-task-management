import { LogoutOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useCookies } from "react-cookie";

const HeaderApp = () => {
  const [cookies, setCookies, removeCookies] = useCookies();

  const handleClickLogout = () => {
    removeCookies("token");
  };

  return (
    <Header style={{ display: "flex" }}>
      <LogoutOutlined
        style={{
          fontSize: "40px",
          color: "white",
          marginLeft: "auto",
        }}
        onClick={handleClickLogout}
      />
    </Header>
  );
};

export default HeaderApp;
