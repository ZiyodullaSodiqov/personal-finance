const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = 5000;
const API_URL = "https://open.er-api.com/v6/latest"; 

app.use(cors());

app.get("/", (req, res) => {
  res.send("Currency Live Rates Socket.io Server");
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  
  const fetchLiveRates = async () => {
    try {
      const response = await axios.get(`${API_URL}/USD`);
      const rates = response.data.rates;

      socket.emit("live-rates", { rates });
    } catch (error) {
      console.error("Error fetching live rates:", error.message);
      socket.emit("live-rates-error", {
        error: "Failed to fetch live rates. Please try again later.",
      });
    }
  };
  
  const interval = setInterval(fetchLiveRates, 5000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
