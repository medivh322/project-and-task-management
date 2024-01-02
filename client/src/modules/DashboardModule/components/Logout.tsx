import { useCookies } from "react-cookie";
import { LogoutOutlined } from "@ant-design/icons";

const Logout = () => {
  const [cookies, setCookies, removeCookies] = useCookies();

  const logoutClick = async () => {
    removeCookies("token");
  };

  return (
    <LogoutOutlined
      style={{
        fontSize: "40px",
        color: "white",
        margin: "auto auto 0 auto",
      }}
      onClick={logoutClick}
    />
  );
};

export default Logout;
