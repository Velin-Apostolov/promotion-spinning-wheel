import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import Cookies from 'js-cookie';
import { customAlphabet } from 'nanoid'

const data = [
  { option: 'Free coffee' },
  { option: 'Free pasta' },
  { option: 'Free cola' },
];

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const nanoid = customAlphabet(alphabet, 6);

//// TODO: check for cookies every minute

const SpinningWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [code, setCode] = useState(() => {
    const storedCode = Cookies.get('promoCode');
    return storedCode || null;
  })
  const [wheelState, setWheelState] = useState(() => {
    const storedState = Cookies.get('spinningWheelState');
    return storedState ? JSON.parse(storedState) : { currentPrize: null, hasSpun: false, expiryDate: null };
  });

  // Fetch current wheel state
  const fetchWheelState = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/coupons/status');
      const data = await response.json();
      setWheelState(data);
      Cookies.set('spinningWheelState', JSON.stringify(data), { expires: 14 });
    } catch (error) {
      console.error('Error fetching wheel state:', error);
    }
  };

  // Polling function to check coupon status
  useEffect(() => {
    const interval = setInterval(fetchWheelState, 60000); // Poll every minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleSpinClick = () => {
    if (!wheelState.hasSpun) {
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    const newCurrentPrize = data[newPrizeNumber].option;
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 14);
    const uniqueCode = nanoid();

    const newWheelState = {
      currentPrize: newCurrentPrize,
      hasSpun: true,
      expiryDate: newExpiryDate.toISOString(),
    };

    setWheelState(newWheelState);
    setCode(uniqueCode);
    setMustSpin(false);
    Cookies.set('spinningWheelState', JSON.stringify(newWheelState), { expires: 14 });
    Cookies.set('promoCode', uniqueCode, { expires: 14 });
  };

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={handleStopSpinning}
        startingOptionIndex={prizeNumber}
      />
      <button onClick={handleSpinClick} disabled={wheelState.hasSpun}>SPIN</button>

      {wheelState.hasSpun && (
        <>
          <h1>{wheelState.currentPrize}</h1>
          {wheelState.expiryDate && <h2>Expires on: {new Date(wheelState.expiryDate).toDateString()}</h2>}
          <h2>Promo Code: {code}</h2>
        </>
      )}
    </>
  );
};

export default SpinningWheel;
