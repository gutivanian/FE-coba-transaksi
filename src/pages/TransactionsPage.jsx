import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../api';
import ModalOverlay from '../components/ModalOverlay';
import PaymentForm from '../components/PaymentForm';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = Cookies.get('user_id'); // Ambil user_id dari cookie
      if (!userId) {
        alert('User ID tidak ditemukan! Silakan kembali ke halaman utama.');
        return;
      }

      try {
        const response = await api.get('/transactions/pending', {
          params: { user_id: userId },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching pending transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const openPaymentModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div>
      <h1>Pending Transactions</h1>
      {transactions.length === 0 ? (
        <p>No pending transactions available.</p>
      ) : (
        <div>
          {transactions.map((transaction) => (
            <div key={transaction.order_number} style={{ marginBottom: '20px' }}>
              <p>Order Number: {transaction.order_number}</p>
              <p>Expired Date: {new Date(transaction.expired_date).toLocaleString()}</p>
              <p>Total Price: ${transaction.total_price}</p>
              <button onClick={() => openPaymentModal(transaction)}>Pay Now</button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedTransaction && (
        <ModalOverlay onClose={closeModal}>
          <PaymentForm snapToken={selectedTransaction.snap_token} />
        </ModalOverlay>
      )}
    </div>
  );
}

export default TransactionsPage;
