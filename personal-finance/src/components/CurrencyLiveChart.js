import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Bar } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL);

const CurrencyLiveChart = () => {
  const [chartDataMap, setChartDataMap] = useState({});

  useEffect(() => {
    socket.on("live-rates", (data) => {
      const time = new Date().toLocaleTimeString();

      const updatedDataMap = { ...chartDataMap };

      Object.keys(data.rates).forEach((currency) => {
        if (!updatedDataMap[currency]) {
          updatedDataMap[currency] = { labels: [], data: [] };
        }
        updatedDataMap[currency].labels = [
          ...updatedDataMap[currency].labels,
          time,
        ].slice(-10);
        updatedDataMap[currency].data = [
          ...updatedDataMap[currency].data,
          data.rates[currency],
        ].slice(-10);
      });

      setChartDataMap(updatedDataMap);
    });

    return () => socket.off("live-rates");
  }, [chartDataMap]);

  return (
    <div
      className="container mt-5 rounded"
      style={{
        backgroundColor: "#fd7e14",
        minHeight: "100vh",
        color: "#ffc107",
      }}
    >
      <h2 className="text-center mb-5" style={{ marginTop:'20px', color: "#fff" }}>
        Real vaqtda valyuta kurslari
      </h2>
      <div className="row">
        {Object.keys(chartDataMap).length > 0 ? (
          Object.keys(chartDataMap).map((currency, index) => (
            <div
              key={index}
              className="mb-5 p-4 rounded shadow col-sm-12 col-md-6"
              style={{
                backgroundColor: "#1E1E1E",
                color: "#ffc107",
                width:'49%',
                margin:"5px 6px"
              }}
            >
              <h4
                className="mb-3 text-center"
                style={{
                  fontWeight: "bold",
                  color: "#ffff",
                }}
              >
                {currency} Exchange Rate
              </h4>
              <Bar
                data={{
                  labels: chartDataMap[currency].labels,
                  datasets: [
                    {
                      label: `${currency} Rate`,
                      data: chartDataMap[currency].data,
                      backgroundColor: "#0d6efd",
                      borderColor: "#0d6efd",
                      borderWidth: 1,
                      borderRadius: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: "#2C6E49",
                      titleColor: "#ffc107",
                      bodyColor: "#ffc107",
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#fff" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                    y: {
                      ticks: { color: "#fff" },
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                    },
                  },
                }}
              />
            </div>
          ))
        ) : (
          <p className="text-center">
            Yuklanishni 10 sekund kuting. Biz har 5 soniyada 
            yangilangan qiymatni olamiz. Agar qiymatlar chop 
            etilmasa 10 sekund kutib sahifani yangilab ko'ring
            </p>
        )}
      </div>
    </div>
  );
};

export default CurrencyLiveChart;