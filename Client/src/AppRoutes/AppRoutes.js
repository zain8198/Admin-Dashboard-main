import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Stock from "../pages/Stock/Stock";
import Contact from "../pages/Contact/Contact";
import Ledger from "../pages/ledger/Ledger";
import Sidebar from "../pages/Siderbar/Sidebar";
import SaleDetail from "../pages/SaleDetail/SaleDetail";
import SaleSummary from "../pages/SaleSummary/SaleSummary";
import Purchsae from "../pages/Purchase/Purchsae";
import Login from "../pages/login/Login";
import Order from "../pages/order/Order";

export let Auth = createContext();
const AppRoutes = () => {
  const [IsAuth, setIsAuth] = useState(localStorage.getItem("IsAuth"));
  return (
    <>
      <Auth.Provider value={setIsAuth}>
        <BrowserRouter>
          {false ? (
            <Routes>
              <Route path="/" element={<Login auth={setIsAuth} />} />
            </Routes>
          ) : (
            <>
              <Sidebar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/order" element={<Order />} />
                <Route path="/ledger" element={<Ledger />} />
                <Route path="/saledetail" element={<SaleDetail />} />
                <Route path="/salesummary" element={<SaleSummary />} />
                <Route path="/purchase" element={<Purchsae />} />
              </Routes>
            </>
          )}
        </BrowserRouter>
      </Auth.Provider>
    </>
  );
};

export default AppRoutes;
