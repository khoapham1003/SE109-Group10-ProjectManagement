import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { DatePicker, Space, Button, Select } from "antd";
import { Card, Row, Descriptions } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const { Option } = Select;

function OrderAdmin() {
  const [items, setItems] = useState([]);
  const [chartData, setChartData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartType, setChartType] = useState("daily");
  const [dataType, setDataType] = useState("totalPrice");
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
      processChartData(data.data, startDate, endDate);
      setItems(data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      console.log("Fetching orders with dates:", startDate, endDate);
      fetchProductData();
    }
  }, [startDate, endDate]);

  const processChartData = (orders, startDate, endDate) => {
    const dailySales = getDatesBetween(startDate, endDate);
    const monthlySales = getMonthsBetween(startDate, endDate);
    const yearlySales = getYearsBetween(startDate, endDate);

    const dailyOrders = getDatesBetween(startDate, endDate);
    const monthlyOrders = getMonthsBetween(startDate, endDate);
    const yearlyOrders = getYearsBetween(startDate, endDate);

    const dailyProducts = getDatesBetween(startDate, endDate);
    const monthlyProducts = getMonthsBetween(startDate, endDate);
    const yearlyProducts = getYearsBetween(startDate, endDate);

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const day = date.toISOString().split("T")[0];
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const year = `${date.getFullYear()}`;

      if (dailySales[day] !== undefined) dailySales[day] += order.totalPrice;
      if (monthlySales[month] !== undefined)
        monthlySales[month] += order.totalPrice;
      if (yearlySales[year] !== undefined)
        yearlySales[year] += order.totalPrice;

      if (dailyOrders[day] !== undefined) dailyOrders[day] += 1;
      if (monthlyOrders[month] !== undefined) monthlyOrders[month] += 1;
      if (yearlyOrders[year] !== undefined) yearlyOrders[year] += 1;

      order.orderItems.forEach((item) => {
        if (dailyProducts[day] !== undefined) dailyProducts[day] += item.amount;
        if (monthlyProducts[month] !== undefined)
          monthlyProducts[month] += item.amount;
        if (yearlyProducts[year] !== undefined)
          yearlyProducts[year] += item.amount;
      });
    });

    setChartData({
      daily: {
        labels: Object.keys(dailySales),
        datasets: [
          {
            label: "Tổng Giá Trị Bán Ra (Theo Ngày)",
            data: Object.values(dailySales),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Đơn Hàng Bán Ra (Theo Ngày)",
            data: Object.values(dailyOrders),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Sản Phẩm Bán Ra (Theo Ngày)",
            data: Object.values(dailyProducts),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      monthly: {
        labels: Object.keys(monthlySales),
        datasets: [
          {
            label: "Tổng Giá Trị Bán Ra (Theo Tháng)",
            data: Object.values(monthlySales),
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Đơn Hàng Bán Ra (Theo Tháng)",
            data: Object.values(monthlyOrders),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Sản Phẩm Bán Ra (Theo Tháng)",
            data: Object.values(monthlyProducts),
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      yearly: {
        labels: Object.keys(yearlySales),
        datasets: [
          {
            label: "Tổng Giá Trị Bán Ra (Theo Năm)",
            data: Object.values(yearlySales),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Đơn Hàng Bán Ra (Theo Năm)",
            data: Object.values(yearlyOrders),
            backgroundColor: "rgba(255, 206, 86, 0.6)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Sản Phẩm Bán Ra (Theo Năm)",
            data: Object.values(yearlyProducts),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    });
  };

  const getDatesBetween = (startDate, endDate) => {
    const dates = {};
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      dates[dateStr] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const getMonthsBetween = (startDate, endDate) => {
    const months = {};
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthStr = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }`;
      months[monthStr] = 0;
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
  };

  const getYearsBetween = (startDate, endDate) => {
    const years = {};
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const yearStr = `${currentDate.getFullYear()}`;
      years[yearStr] = 0;
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
    return years;
  };

  const handleStartDateChange = (date) => {
    console.log("Start date selected:", date);
    setStartDate(date ? date.startOf("day").toDate() : null);
  };

  const handleEndDateChange = (date) => {
    console.log("End date selected:", date);
    setEndDate(date ? date.endOf("day").toDate() : null);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleDataTypeChange = (type) => {
    setDataType(type);
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
      <div>
        <h2>Biểu Đồ Tổng Giá Trị Bán Ra</h2>
        <Space direction="vertical" size={12}>
          <DatePicker
            placeholder="Chọn ngày bắt đầu"
            onChange={handleStartDateChange}
            format="YYYY-MM-DD"
          />
          <DatePicker
            placeholder="Chọn ngày kết thúc"
            onChange={handleEndDateChange}
            format="YYYY-MM-DD"
          />
        </Space>
        <Space>
          <Button onClick={() => handleChartTypeChange("daily")}>
            Theo Ngày
          </Button>
          <Button onClick={() => handleChartTypeChange("monthly")}>
            Theo Tháng
          </Button>
          <Button onClick={() => handleChartTypeChange("yearly")}>
            Theo Năm
          </Button>
        </Space>
        <Space>
          <Button onClick={() => handleDataTypeChange("totalPrice")}>
            Tổng Giá Trị
          </Button>
          <Button onClick={() => handleDataTypeChange("orderCount")}>
            Số Lượng Đơn Hàng
          </Button>
          <Button onClick={() => handleDataTypeChange("productCount")}>
            Số Lượng Sản Phẩm
          </Button>
        </Space>
        {chartType === "daily" && chartData.daily && (
          <div>
            <h3>Theo Ngày</h3>
            <Bar
              data={{
                labels: chartData.daily.labels,
                datasets: [
                  dataType === "totalPrice" && {
                    label: "Tổng Giá Trị Bán Ra (Theo Ngày)",
                    data: chartData.daily.datasets[0].data,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                  dataType === "orderCount" && {
                    label: "Số Lượng Đơn Hàng Bán Ra (Theo Ngày)",
                    data: chartData.daily.datasets[1].data,
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                  },
                  dataType === "productCount" && {
                    label: "Số Lượng Sản Phẩm Bán Ra (Theo Ngày)",
                    data: chartData.daily.datasets[2].data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                  },
                ].filter(Boolean),
              }}
            />
          </div>
        )}
        {chartType === "monthly" && chartData.monthly && (
          <div>
            <h3>Theo Tháng</h3>
            <Bar
              data={{
                labels: chartData.monthly.labels,
                datasets: [
                  {
                    label: "Tổng Giá Trị Bán Ra (Theo Tháng)",
                    data: chartData.monthly.datasets[0].data,
                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                    borderColor: "rgba(255, 159, 64, 1)",
                    borderWidth: 1,
                  },
                  {
                    label: "Số Lượng Đơn Hàng Bán Ra (Theo Tháng)",
                    data: chartData.monthly.datasets[1].data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                  },
                  {
                    label: "Số Lượng Sản Phẩm Bán Ra (Theo Tháng)",
                    data: chartData.monthly.datasets[2].data,
                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        )}
        {chartType === "yearly" && chartData.yearly && (
          <div>
            <h3>Theo Năm</h3>
            <Bar
              data={{
                labels: chartData.yearly.labels,
                datasets: [
                  {
                    label: "Tổng Giá Trị Bán Ra (Theo Năm)",
                    data: chartData.yearly.datasets[0].data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                  },
                  {
                    label: "Số Lượng Đơn Hàng Bán Ra (Theo Năm)",
                    data: chartData.yearly.datasets[1].data,
                    backgroundColor: "rgba(255, 206, 86, 0.6)",
                    borderColor: "rgba(255, 206, 86, 1)",
                    borderWidth: 1,
                  },
                  {
                    label: "Số Lượng Sản Phẩm Bán Ra (Theo Năm)",
                    data: chartData.yearly.datasets[2].data,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
      <div>
        <h3>Tổng giá trị bán ra: {total}</h3>
        <h3>Tổng đơn hàng: {items.length}</h3>
        <h3>Tổng số lượng sản phẩm đã bán ra: {totalAmount}</h3>
      </div>
      <Row>
        <h2 className="detail_h2">GIAO DỊCH</h2>
      </Row>
      <div style={{ display: "flex", flexDirection: "column-reverse" }}>
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
