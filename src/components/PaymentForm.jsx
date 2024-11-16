import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function PaymentForm({ snapToken, orderNumber }) {
  const navigate = useNavigate();
  let isSnapOpen = false;

  const handlePayment = () => {
    if (isSnapOpen) {
      console.warn('Snap payment already in progress.');
      return;
    }
    isSnapOpen = true;
    window.snap.pay(snapToken, {
      onSuccess: async (result) => {
        // alert('Payment Berhasil!');
        await checkAndUpdateStatus(); // Call checkTransactionStatus and update status after payment success
        navigate('/orders'); // Redirect to orders page after successful payment and update
      },
      onPending: async (result) => {
        // alert('Payment Pending');
        await checkAndUpdateStatus(); // Check status if payment is pending
        navigate('/orders'); // Redirect to orders page
      },
      onError: (result) => {
        alert('Payment Failed');
        console.error(result);
      },
      onClose: () => {
        alert('Payment popup closed without finishing');
      },
    });
  };

  // Function to check and  update transaction status
  const checkAndUpdateStatus = async () => {
    try {
      const response = await api.get(`/payments/${orderNumber}`); // API call to check status
      console.log('Transaction status updated:', response.data);
    } catch (error) {
      console.error('Failed to check transaction status:', error);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <button onClick={handlePayment}>Pay Now</button>;
}

export default PaymentForm;
