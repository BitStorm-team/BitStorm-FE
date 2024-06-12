import ReactApexChart from "react-apexcharts";
import { Row, Col, Typography } from "antd";
// import eChart from "./configs/eChart";

function EChart({ data }) {
  const { Title, Paragraph } = Typography;

  const eChart = {
    series: [
      {
        name: "Users",
        data: data.map((item) => item.count),
        color: "#fff",
      },
    ],

    options: {
      chart: {
        type: "bar",
        width: "100%",
        height: "auto",

        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"],
      },
      grid: {
        show: true,
        borderColor: "#ccc",
        strokeDashArray: 2,
      },
      xaxis: {
        categories: data.map((item) => item.month),
        labels: {
          show: true,
          align: "right",
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: data.map(() => "#fff"),
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          align: "right",
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: data.map(() => "#fff"),
          },
        },
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return val + " Users";
          },
        },
      },
    },
  };



  return (
    <>
      <div id="chart">
        <ReactApexChart
          className="bar-chart"
          options={eChart.options}
          series={eChart.series}
          type="bar"
          height={220}
        />
      </div>
      <div className="chart-vistior">
        <Title level={5}>Active Users</Title>
        <Paragraph className="lastweek">
          We have created multiple options for you to put together and customise
          into pixel perfect pages.
        </Paragraph>

      </div>
    </>
  );
}

export default EChart;
