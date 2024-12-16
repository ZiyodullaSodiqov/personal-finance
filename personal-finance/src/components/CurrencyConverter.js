import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import CurrencyLiveChart from "./CurrencyLiveChart";

const socket = io("http://localhost:5000"); 

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("GBP");
  const [amount, setAmount] = useState(10000);
  const [result, setResult] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [liveRates, setLiveRates] = useState({});
 
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(
          `https://open.er-api.com/v6/latest/${fromCurrency}`
        );
        setCurrencies(Object.keys(response.data.rates));
        setExchangeRate(response.data.rates[toCurrency]);
        setResult(amount * response.data.rates[toCurrency]);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchRates();
  }, [fromCurrency, toCurrency, amount]);

  
  useEffect(() => {
    socket.on("live-rates", (data) => {
      setLiveRates(data.rates);
    });

    return () => socket.disconnect();
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const style ={
    cnt_bg:{
      backgroundColor:'#fd7e14'
    },
    text:{
      fontWeight: 900,
      color: '#fff',
      fontSize: 30
    },
    title:{
      fontWeight: 600,
      color: '#fff',
      fontSize: 25
    },
    option:{
      background:'#000',
      color:'#ffc107'
    }
  }

  return (
    <>
    <div className="container mt-5">
      <div className="row">
          <div className="rounded p-4 shadow-sm" style={style.cnt_bg}>
            <h5 style={style.text}>Valyuta konvertori</h5>
            <div className="form-group mb-3">
              <label style={style.title}>Miqdori</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <label style={style.title}>Dan</label>
                <select
                  className="form-select"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency} style={style.option} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={style.title}>Ga</label>
                <select
                  className="form-select"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency} style={style.option} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <h4 className="text-center mt-3" style={style.title}>
              {formatNumber(result)} {toCurrency}
            </h4>
            <p className="text-center" style={style.title}>
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </p>
          </div>
        </div>
    </div>
    <div className="container">
      <div className="row">
        <CurrencyLiveChart />
      </div>
    </div>
    </>
  );
};

export default CurrencyConverter;