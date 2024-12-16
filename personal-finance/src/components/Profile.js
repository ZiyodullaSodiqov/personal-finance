import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Profile = () => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('transactions')) || [];
  });
  const [balance, setBalance] = useState(0); 
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    currency: 'USD',
    note: '',
  });

  useEffect(() => {
    axios
      .get('https://v6.exchangerate-api.com/v6/5f39e4c809508bba409d6b91/latest/USD')
      .then(response => {
        setExchangeRates(response.data.conversion_rates);
      })
      .catch(error => console.error('Error ', error));
  }, []);

  useEffect(() => {
    if (exchangeRates && Object.keys(exchangeRates).length > 0) {
      updateBalance();
    }
  }, [transactions, exchangeRates]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const updateBalance = () => {
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
      return; 
    }

    const totalBalance = transactions.reduce((acc, transaction) => {
      const amount = parseFloat(transaction.amount);
      const transactionCurrency = transaction.currency;

      const convertedAmount =
        transactionCurrency === 'USD'
          ? amount
          : amount / exchangeRates[transactionCurrency];

      return transaction.type === 'income'
        ? acc + convertedAmount
        : acc - convertedAmount; 
    }, 0);

    setBalance(totalBalance);
    localStorage.setItem('balance' , totalBalance)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addTransaction = () => {
    const newTransaction = { 
      ...formData, 
      id: Date.now(),
      date: new Date().toLocaleString()
    };
    setTransactions([...transactions, newTransaction]);
    setFormData({ type: 'income', amount: '', category: '', currency: 'USD', note: '' });
  };

  const filterTransactions = (type) => {
    return transactions.filter(transaction => transaction.type === type);
  };

  const calculateChartData = (type) => {
    const filtered = filterTransactions(type);
    const categories = [...new Set(filtered.map(transaction => transaction.category))];
    const data = categories.map(category => {
      return filtered
        .filter(transaction => transaction.category === category)
        .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
    });
    return {
      labels: categories,
      datasets: [
        {
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        },
      ],
    };
  };

  const calculateTotalChartData = () => {
    const data = transactions.reduce(
      (acc, transaction) => {
        acc[transaction.type] += parseFloat(transaction.amount);
        return acc;
      },
      { income: 0, expense: 0 }
    );
    return {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          data: [data.income, data.expense],
          backgroundColor: ['#4CAF50', '#F44336'],
        },
      ],
    };
  };

  const clear = () => {
    localStorage.clear();
    window.location.href = '/profile'
  }

  return (
    <>

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
            <button onClick={clear }  className='btn btn-danger'>
              Tozalash
            </button>
          </div>
        </div>
      </div>

    <div className="container mt-5">
      <div className="card mb-4" style={{background:'#fd7e14'}}>
        <div className="card-header">
          <p style={{color:'#fff'}}>
          Tranzaksiya qo'shish
          </p>
          </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <select
                name="type"
                className="form-control"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="income">Kirim</option>
                <option value="expense">Chiqim</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="number"
                name="amount"
                className="form-control"
                placeholder="Qiymat"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-3">
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Kategoriya">Kategoriya</option>
                <option value="Transport">Transport</option>
                <option value="Oziq-ovqat">Oziq-ovqat</option>
                <option value="komunal-tolov">Komunal-to'lov</option>
                <option value="Kiyim-kechak">Kiyim-kechak</option>
                <option value="Elektronika">Elektronika</option>
                <option value="Mobile-oprator">Mobile operatorlar</option>
                <option value="Soliq">Soliq</option>
                <option value="Internet">Internet</option>
                <option value="Talim">Talim</option>
                <option value="Sogliq">Sog'liq</option>
                <option value="DavXizmalari">Davlat Xizmatlari va DYHXX (GAI)</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                name="currency"
                className="form-control"
                value={formData.currency}
                onChange={handleInputChange}
              >
                {Object.keys(exchangeRates).map(rate => (
                  <option key={rate} value={rate}>{rate}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <textarea
              name="note"
              className="form-control"
              placeholder="Note"
              value={formData.note}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button className="btn btn-light mt-3" onClick={addTransaction}>
            Tranzaksiya qo'shish
          </button>
        </div>
      </div>
     
      <div className="mb-4">
        <h4 style={{color:'#fff'}}>Joriy balans: <span style={{color:'#fd7e14'}}>{balance.toFixed(2)}</span> USD</h4>
      </div>
   
      <div className="row">
        <div className="col-md-6">
          <h5 style={{color:'#fff'}}>Daromad jadvali</h5>
          <Pie data={calculateChartData('income')} />
        </div>
        <div className="col-md-6">
          <h5 style={{color:'#fff'}}>Xarajatlar jadvali</h5>
          <Pie data={calculateChartData('expense')} />
        </div>
      </div>

      <div className="mt-5">
        <h5 style={{color:'#fff'}}>Jami tranzaktsiyalar</h5>
        <Bar data={calculateTotalChartData()} />
      </div>
     
      <div className="row mt-4">
        <div className="col-md-6">
          <h5 style={{color:'#fff'}}>Daromad ro'yxati</h5>
          <ul className="list-group" style={{backgroundColor:'#0dcaf0'}}>
            {filterTransactions('income').map(transaction => (
              <li key={transaction.id} className="list-group-item">
                {transaction.amount} {transaction.currency} - {transaction.category} ({transaction.note}) <br />
                <small>{transaction.date}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h5 style={{color:'#fff'}}>Xarajatlar ro'yxati</h5>
          <ul className="list-group">
            {filterTransactions('expense').map(transaction => (
              <li key={transaction.id} className="list-group-item">
                {transaction.amount} {transaction.currency} - {transaction.category} ({transaction.note}) <br />
                <small>{transaction.date}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;