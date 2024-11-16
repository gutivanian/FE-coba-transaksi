// HomePage.jsx
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = () => {
    if (!Number.isInteger(parseInt(userId))) {
      alert('User ID harus berupa angka!');
      return;
    }

    // Simpan user_id ke cookie
    Cookies.set('user_id', userId, { expires: 7 }); // Cookie bertahan selama 7 hari

    // Pindah ke halaman berikutnya (misalnya, /products)
    navigate('/products');
  };

  return (
    <div>
      <h1>Enter User ID</h1>
      <input
        type="text"
        value={userId}
        onChange={handleInputChange}
        placeholder="Enter User ID (integer)"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default HomePage;
