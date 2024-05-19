import classNames from "classnames/bind";
import logo from "../../../../assets/images/logo.jpg"
import MenuSlide from "../../../MenuSlide";
import SearchBar from "../../../SearchBar";
import CartButton from "../../../CartButton";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const cx = classNames.bind();

function Header() {
  const navigate = useNavigate();
  return (
    <header className={cx("h_wrapper")}>
      <div
        className={cx("inner h_log_inner h_inner")}
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          className={cx("h_logo")}
          onClick={() => {
            navigate("/");
          }}
        >
          { <img
            className="h_logo_image"
            src={logo}
            alt="1015 BookStore"
          /> }
        </div>
      </div>
    </header>
  );
}

export default Header;
