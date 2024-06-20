import React, { useState } from 'react';

const AdminPanel = () => {
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState('');
  
  const [logged, setLogged] = useState(() => {
    const currentState = localStorage.getItem('logged');
    return currentState ? true : false;
  })

  const handleCheckCoupon = () => {
    const foundCoupon = coupons.find(c => c.code === couponCode);
    if (foundCoupon) {
      setCoupon(foundCoupon);
      setError('');
    } else {
      setCoupon(null);
      setError('Coupon not found');
    }
  };

  const handleMarkAsUsed = () => {
    if (coupon) {
      coupon.used = true;
      // Save the updated coupons data (e.g., update the JSON file or database)
      // For simplicity, we're just updating the local variable here
      setCoupon({ ...coupon });
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Enter coupon code"
      />
      <button onClick={handleCheckCoupon}>Check Coupon</button>

      {error && <p>{error}</p>}
      {coupon && (
        <div>
          <p>Prize: {coupon.prize}</p>
          <p>Expiry Date: {new Date(coupon.expiryDate).toDateString()}</p>
          <p>Used: {coupon.used ? 'Yes' : 'No'}</p>
          {!coupon.used && <button onClick={handleMarkAsUsed}>Mark as Used</button>}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
