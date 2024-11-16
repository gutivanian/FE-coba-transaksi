// OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = Cookies.get('user_id');

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

  const handlePaymentClick = (order) => {
    navigate(`/payment`, { state: { orderNumber: order.order_number, amount: order.total_price } });
  };

  return (
    <div>
      <h1>Orders Page</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={`${order.order_number}`} style={{ marginBottom: '20px' }}>
              <h3>Order Number: {order.order_number}</h3>
              <p>Total Price: ${order.total_price}</p>
              <h4>Items:</h4>
              <p>Product ID: {order.product_id}</p>
              <p>Product Name: {order.product_name}</p>
              <p>Quantity: {order.quantity}</p>
              <p>Price per Quantity: ${order.price_per_quantity}</p>
              <p>Subtotal: ${order.subtotal}</p>
              <button onClick={() => handlePaymentClick(order)}>Pay Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
