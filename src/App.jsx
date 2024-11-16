// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
import TransactionsPage from './pages/TransactionsPage'; // Impor halaman transaksi

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Halaman utama untuk memasukkan user_id */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/transactions" element={<TransactionsPage />} /> {/* Tambahkan route untuk halaman transaksi */}
      </Routes>
    </Router>
  );
}

export default App;
