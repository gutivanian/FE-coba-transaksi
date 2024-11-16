import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import Cookies from 'js-cookie';

function ProductsPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Ambil user_id dari cookie
    const storedUserId = Cookies.get('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      alert('User ID tidak ditemukan! Kembali ke halaman utama untuk memasukkan User ID.');
    }
  }, []);
  return (
    <div>
      <h1>Products Page</h1>
      {userId && <p>Welcome, User ID: {userId}</p>}
      <ProductList />
    </div>
  );
}

export default ProductsPage;
