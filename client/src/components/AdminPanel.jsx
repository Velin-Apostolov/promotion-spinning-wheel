import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [couponCode, setCouponCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [coupon, setCoupon] = useState('');
  const [error, setError] = useState('');
  const [logged, setLogged] = useState(() => {
    const currentState = localStorage.getItem('logged');
    return currentState ? true : false;
  });

  const handleCheckCoupon = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: couponCode }),
    };
    try {
      const response = await fetch('https://sleepy-depths-55109-f9277d07b22f.herokuapp.com/admin/check', options);
      const data = await response.json();
      if (data.message) {
        setError(t(data.message));
        setCouponCode('');
      } else {
        setError('');
        setCouponCode('');
        setCoupon(data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMarkAsUsed = async () => {
    const options = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ couponData: coupon }),
    };

    const response = await fetch('https://sleepy-depths-55109-f9277d07b22f.herokuapp.com/promo/use', options);

    const data = await response.json();
    if (data.message == 'Successfully marked as used!') {
      setCoupon(state => ({ ...state, used: true }));
    } else {
      setError(data.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username == 'mariococo' && password == '111111') {
      const loginInfo = {
        username,
        password,
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
      };

      try {
        const response = await fetch('https://sleepy-depths-55109-f9277d07b22f.herokuapp.com/user/login', options);
        const data = await response.json();
        if (data.message == 'Successful login!') {
          localStorage.setItem('logged', 'true');
          setError('');
          setLogged(true);
        } else {
          setError('Invalid credentials!');
        }

      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    } else {
      setError('Invalid credentials!');
    }
  }

  return (
    <>
      {logged && (
        <div>
          <h1>Admin Panel</h1>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
          />
          <button onClick={handleCheckCoupon}>Check Coupon</button>

          {error && <p className='error-message'>{error}</p>}
          {coupon && (
            <div className='coupon-info'>
              <p className='coupon-details'>Prize: {coupon.prize}</p>
              <p className='coupon-details'>Expiry Date: {new Date(coupon.expiryDate).toDateString()}</p>
              <p className='coupon-details'>Used: {coupon.used ? 'Yes' : 'No'}</p>
              {!coupon.used && <button onClick={handleMarkAsUsed}>Mark as Used</button>}
            </div>
          )}
        </div>
      )}

      {!logged && (
        <div className="admin-login">
          <h2>{t('admin_login')}</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">{`${t('username')}:`}</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{`${t('password')}:`}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">{t('login')}</button>
          </form>
        </div>
      )}
    </>
  );
};

export default AdminPanel;