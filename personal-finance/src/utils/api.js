import React from 'react'
import axios from "axios";

const API_KEY = "5f39e4c809508bba409d6b91"; // ExchangeRate API kaliti
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export const getExchangeRates = async (baseCurrency = "USD") => {
  try {
    const response = await axios.get(`${BASE_URL}/latest/${baseCurrency}`);
    return response.data.conversion_rates;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};