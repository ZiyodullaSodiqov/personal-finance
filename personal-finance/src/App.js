import React from "react";
import { AppProvider } from "./hook/AppContext";
import CurrencyConverter from "./components/CurrencyConverter";
import { Link } from 'react-router-dom';
import './App.css'; 

function App() {
  const balance = localStorage.getItem('balance')
  return (
    <AppProvider>
      <div className="app-container">
        <div className="nav-bar">
          <div className="nav-link">
            <Link to={'/'} className="link-hx">
              Konvertor
            </Link>
          </div>
          <div className="nav-link">
            <Link to={'/profile'} className="link-hx">
              Boshqaruv paneli
            </Link>
          </div>
          <div className="nav-link">
            <Link className="link-hx">
            Joriy balans :{parseFloat(balance).toFixed(2)} USD
            </Link>
          </div>
        </div>
        <div className="container">
          <CurrencyConverter />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;