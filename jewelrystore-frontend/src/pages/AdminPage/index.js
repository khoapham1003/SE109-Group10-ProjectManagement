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
} from "antd";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ProductAdmin from "./Component";
import UserAdmin from "./Component/User";

function AdminPage() {
  
  return (
    <div>
     {/* <ProductAdmin/> */}
     <UserAdmin/>
    </div>
  );
}

export default AdminPage;
