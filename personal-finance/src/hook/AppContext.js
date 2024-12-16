// src/context/AppContext.js
import React, { createContext, useReducer, useContext } from "react";

const AppContext = createContext();

const initialState = {
  transactions: [],
  balance: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        balance: state.balance + (action.payload.type === "income" ? 1 : -1) * action.payload.amount,
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);