

import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import { useEffect } from "react";
// import lineChart from "./configs/lineChart";

function LineChart({users, bookings}) {
  const { Title, Paragraph } = Typography;

  const lineChart = {
    series: [
      {
        name: "Users",
        data: bookings.map((item) => item.count),
        offsetY: 0,
      },
      {
        name: "Bookings",
        data: users.map((item) => item.count),
        offsetY: 0,
      },
    ],

    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },

      legend: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },

      xaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: [
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
            ],
          },
        },
        categories: bookings.map((item) => item.month),
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };
  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Active Users And Bookings</Title>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Users</li>
            <li>{<MinusOutlined />} Bookings</li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
