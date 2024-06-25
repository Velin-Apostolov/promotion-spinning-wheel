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

const clearAllCookiesAsync = async () => {
  const allCookies = Cookies.get();
  for (const cookieName in allCookies) {
    Cookies.remove(cookieName);
  }
};

const nanoid = customAlphabet(alphabet, 6);

const SpinningWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(() => {
    const currentPrize = Cookies.get('prizeNumber');
    return currentPrize ? Number(currentPrize) : 0;
  });
  const [currentPrize, setCurrentPrize] = useState(() => {
    const currentPrizeState = Cookies.get('currentPrize');
    return currentPrizeState || null;
  });
  const [expiryDate, setExpiryDate] = useState(() => {
    const currDate = Cookies.get('expiryDate');
    return currDate || null;
  });
  const [hasSpun, setHasSpun] = useState(() => {
    const currSpun = Cookies.get('hasSpun');
    return currSpun ? true : false;
  })
  const [code, setCode] = useState(() => {
    const storedCode = Cookies.get('promoCode');
    return storedCode || null;
  })

  useEffect(() => {
    const fetchData = async () => {
      if (code !== null) {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
          credentials: 'include',
        };

        try {
          const response = await fetch('http://localhost:5000/promo/check', options);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();

          if (data === true) {
            await clearAllCookiesAsync();
            setCode(null);
            setPrizeNumber(0);
            setCurrentPrize(null);
            setExpiryDate(null);
            setHasSpun(false);
          } else if (data.message == 'Not found!') {
            await clearAllCookiesAsync();
            setCode(null);
            setPrizeNumber(0);
            setCurrentPrize(null);
            setExpiryDate(null);
            setHasSpun(false);
          }
        } catch (error) {
          console.error('Error: ', error);
          await clearAllCookiesAsync();
          setCode(null);
          setPrizeNumber(0);
          setCurrentPrize(null);
          setExpiryDate(null);
          setHasSpun(false);
        }
      }
    };

    fetchData();
  }, [code]);

  const handleSpinClick = () => {
    if (!hasSpun) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setHasSpun(true);
    }
  };

  const handleStopSpinning = async () => {
    const newCurrentPrize = data[prizeNumber].option;
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 14);
    const uniqueCode = nanoid();
    console.log(uniqueCode);

    setCode(uniqueCode);
    setMustSpin(false);
    setCurrentPrize(newCurrentPrize);
    setExpiryDate(newExpiryDate.toISOString());

    const payload = {
      prizeNumber,
      currentPrize: newCurrentPrize,
      hasSpun,
      expiryDate: newExpiryDate.toISOString(),
      code: uniqueCode,
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    };

    try {
      const response = await fetch('http://localhost:5000/promo/add', options);

      if (!response.ok) {
        throw new Error('Network response was not ok:' + response.statusText);
      }

      const data = await response.json();

      console.log('Successful request!');
    } catch (error) {
      console.error(error);
    }
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
      <button onClick={handleSpinClick} disabled={hasSpun}>SPIN</button>

      {hasSpun && (
        <>
          {currentPrize && <h1>{currentPrize}</h1>}
          {expiryDate && <h2>Expires on: {new Date(expiryDate).toDateString()}</h2>}
          {code && <h2>Promo Code: {code}</h2>}
        </>
      )}
    </>
  );
};

export default SpinningWheel;