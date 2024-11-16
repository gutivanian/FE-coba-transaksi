// PaymentPage.jsx
import React, { useEffect, useState,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import ModalOverlay from '../components/ModalOverlay';
import api from '../api';
import Cookies from 'js-cookie';

function PaymentPage() {
  const location = useLocation();
  const { orderNumber, amount } = location.state || {}; // Mengambil orderNumber dan amount dari state
  const [snapToken, setSnapToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null); // State untuk menyimpan detail order

  const orderNumberChanges = useRef(0);
  const amountChanges = useRef(0);
  const snapTokenChanges = useRef(0);
  const useEffectRunCount = useRef(0); // Ref to track number of useEffect execution

  useEffect(() => {
    // Increment the useEffect run count
    useEffectRunCount.current += 1;

    // Skip the POST request block if useEffect has run more than once
    if (useEffectRunCount.current > 1) {
      console.log('useEffect has run more than once, skipping POST request block.');
      return;
    }

    // Log changes for debugging
    if (orderNumberChanges.current !== orderNumber) {
      orderNumberChanges.current += 1;
      console.log(`orderNumber berubah ke nilai: ${orderNumber}, total perubahan: ${orderNumberChanges.current}`);
    }

    if (amountChanges.current !== amount) {
      amountChanges.current += 1;
      console.log(`amount berubah ke nilai: ${amount}, total perubahan: ${amountChanges.current}`);
    }

    if (snapTokenChanges.current !== snapToken) {
      snapTokenChanges.current += 1;
      console.log(`snapToken berubah ke nilai: ${snapToken}, total perubahan: ${snapTokenChanges.current}`);
    }

    const fetchOrderDetails = async () => {
      try {
        const userId = Cookies.get('user_id');
        if (!userId) {
          alert('User ID tidak ditemukan! Silakan kembali ke halaman utama.');
          return;
        }
        const response = await api.get(`/orders/details/${orderNumber}`, {
          params: { user_id: userId },
        });
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    const fetchSnapToken = async () => {
      try {
        const userId = Cookies.get('user_id');
        if (!userId) {
          alert('User ID tidak ditemukan! Silakan kembali ke halaman utama.');
          return;
        }
        if (!snapToken) {
          const paymentData = { amount, user_id: userId, order_number: orderNumber };
          const response = await api.post('/payments', paymentData);
          console.log(response);
          setSnapToken(response.data.snapToken);
        }
      } catch (error) {
        console.error('Error fetching snapToken:', error);
      }
    };

    if (orderNumber) {
      fetchOrderDetails();
    }
    if (amount && !snapToken) {
      fetchSnapToken();
    }
  }, [orderNumber, amount, snapToken]);

  const openModal = () => {
    console.log('Modal opened');
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    console.log('Modal closed');
    setIsModalOpen(false);
  };
  
  return (
    <div>
      <h1>Payment Page</h1>
      {orderNumber ? <p>Order Number: {orderNumber}</p> : <p>Order details not available.</p>}
      <p>Amount: ${amount}</p>

      {/* Tampilkan detail order jika tersedia */}
      {orderDetails && (
        <div>
          <h3>Order Details</h3>
          <p>Product Name: {orderDetails.product_name}</p>
          <p>Quantity: {orderDetails.quantity}</p>
          <p>Price per Item: ${orderDetails.price_per_quantity}</p>
          <p>Subtotal: ${orderDetails.subtotal}</p>
        </div>
      )}

      <button onClick={openModal} disabled={!snapToken}>Proceed to Pay</button>

      {isModalOpen && (
        <ModalOverlay onClose={closeModal}>
          <PaymentForm snapToken={snapToken} />
        </ModalOverlay>
      )}
    </div>
  );
}

export default PaymentPage;
