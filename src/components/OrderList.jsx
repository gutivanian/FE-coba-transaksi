// OrderList.jsx
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../api';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = Cookies.get('user_id'); // Mengambil user_id dari cookie

      if (!userId) {
        alert('User ID tidak ditemukan! Silakan kembali ke halaman utama.');
        return;
      }

      try {
        const response = await api.get('/orders', {
          params: { user_id: userId },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      {orders.map((order) => (
        <div key={`${order.order_number}`}>
          <p>Order Number: {order.order_number}</p> {/* Tampilkan order_number */}
          <p>Total Price: ${order.total_price}</p>
          <p>Product Name: {order.product_name}</p>
          <p>Quantity: {order.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderList;
