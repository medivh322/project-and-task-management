import { useCookies } from "react-cookie";
import { LogoutOutlined } from "@ant-design/icons";

const Logout = () => {
  const [_cookies, _setCookies, removeCookies] = useCookies(["token"]);

  const logoutClick = async () => {
    removeCookies("token");
  };

  return (
    <LogoutOutlined
      style={{
        fontSize: "40px",
        color: "white",
      }}
      onClick={logoutClick}
    />
  );
};

export default Logout;
