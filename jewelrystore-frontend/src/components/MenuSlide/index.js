import { MenuOutlined } from "@ant-design/icons";
import { Menu, Button } from "antd";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

const { SubMenu } = Menu;

const MenuSlide = ({ onMenuSelect }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  const [menuData, setMenuData] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchMenuData = async () => {
    try {
      const response = await fetch("http://localhost:3001/product/get-all-type", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMenuData(data.data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  console.log("menuslide:", menuData);

  const handleMenuClick = (itemName) => {
    console.log("Selected item:", itemName);
    onMenuSelect(itemName);
  };

  const renderMenuItems = (menuItems) => {
    return menuItems.map((itemName) => (
      <Menu.Item key={itemName} onClick={() => handleMenuClick(itemName)}>
        {itemName}
      </Menu.Item>
    ));
  };

  return (
    <div>
      <Button onClick={() => setMenuVisible(!menuVisible)}>
        <MenuOutlined />
      </Button>
      {menuVisible && (
        <Menu
          selectedKeys={[selectedKeys]}
          style={{
            width: "10vw",
            backgroundColor: "#fff",
            borderRight: "none",
            fontSize: "10px"
          }}
        >
          {renderMenuItems(menuData)}
        </Menu>
      )}
    </div>
  );
};

export default MenuSlide;
