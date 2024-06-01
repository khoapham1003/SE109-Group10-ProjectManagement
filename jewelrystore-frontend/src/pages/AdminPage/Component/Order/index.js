import {
  Button,
  Card,
  Col,
  Image,
  Row,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Descriptions,
} from "antd";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IoMdAdd } from "react-icons/io";

const { Option } = Select;

function OrderAdmin() {
  const [items, setItems] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const { confirm } = Modal;

  const getCookie = (cookieName) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  };
  const userId = getCookie("userid");
  const jwtToken = getCookie("accessToken");

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/order/get-all-order/`,
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.data);

      setItems(data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error;
    }
  };

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const totalAmount = items.reduce((total, order) => {
    return (
      total +
      order.orderItems.reduce((orderTotal, item) => orderTotal + item.amount, 0)
    );
  }, 0);
  return (
    <div>
      <div className="admin-info">
        <div className="admin-info-totalSale">
          <h3>Tổng giá trị bán ra: </h3>
          <span>{total}</span>
        </div>
        <div className="admin-info-totalOrder">
          <h3>Tổng đơn hàng: </h3>
          <span>{items.length}</span>
        </div>
        <div className="admin-info-totalProduct">
          <h3>Tổng số lượng sản phẩm bán ra: </h3>
          <span>{totalAmount}</span>
        </div>
      </div>
      <Row>
        <h2 className="detail_h2">GIAO DỊCH GẦN ĐÂY</h2>
      </Row>
      <div
        className="order-history"
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        {items.map((item) => (
          <Card
            className="order_history_cart"
            bodyStyle={{ padding: "5px 3vw 0px" }}
            hoverable
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tên người nhận">
                {item.shippingAddress.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="SĐT">
                {item.shippingAddress.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ nhận hàng">
                {item.shippingAddress.address}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày mua">
                {item.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng đơn hàng">
                {item.totalPrice}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default OrderAdmin;
