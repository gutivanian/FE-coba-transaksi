// ProductList.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import Cookies from 'js-cookie';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // console.log(response);
        console.log(response.data)
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({ ...quantities, [productId]: quantity });
  };

  const handleOrder = async (productId, price) => {
    const quantity = quantities[productId] || 1;
    const userId = Cookies.get('user_id'); // Ambil user_id dari cookie
  
    if (!userId) {
      alert('User ID tidak ditemukan. Silakan kembali ke halaman utama untuk memasukkan User ID.');
      return;
    }
  
    try {
      const response = await api.post('/orders', {
        product_id: productId,
        total_price: price * quantity,
        quantity,
        user_id: userId,
      });
      alert(`Order created successfully for Product ID: ${productId}, Order Number: ${response.data.order_number}`);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };
  

  return (
    <div>
      <h2>Products</h2>
      {products.map((product) => (
        <div key={product.product_id} style={{ marginBottom: '20px' }}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={quantities[product.product_id] || 1}
            onChange={(e) => handleQuantityChange(product.product_id, parseInt(e.target.value))}
          />
          <button onClick={() => handleOrder(product.product_id, product.price)}>Order</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
