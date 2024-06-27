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
          const response = await fetch('https://sleepy-depths-55109-f9277d07b22f.herokuapp.com/promo/check', options);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();

          if (data === true) {
            await clearAllCookiesAsync();
            setPrizeNumber(0);
            setCurrentPrize(null);
            setExpiryDate(null);
            setHasSpun(false);
            setCode(null);
          } else if (data.message == 'Not found!') {
            await clearAllCookiesAsync();
            setPrizeNumber(0);
            setCurrentPrize(null);
            setExpiryDate(null);
            setHasSpun(false);
            setCode(null);
          }
        } catch (error) {
          console.error('Error: ', error);
          await clearAllCookiesAsync();
          setPrizeNumber(0);
          setCurrentPrize(null);
          setExpiryDate(null);
          setHasSpun(false);
          setCode(null);
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

    setPrizeNumber(newPrizeNumber => newPrizeNumber);
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
      const response = await fetch('https://sleepy-depths-55109-f9277d07b22f.herokuapp.com/promo/add', options);

      if (!response.ok) {
        throw new Error('Network response was not ok:' + response.statusText);
      }

      const data = await response.json();
      const newDate = new Date(data.expiryDate);
      console.log(newDate);

      console.log('Successful request!');
      Cookies.set('promoCode', uniqueCode, { expires: 14 });
      Cookies.set('prizeNumber', data.prizeNumber, { expires: 14 });
      Cookies.set('hasSpun', data.hasSpun, { expires: 14 });
      Cookies.set('currentPrize', data.currentPrize, { expires: 14 });
      Cookies.set('expiryDate', newDate, { expires: 14 });
      setCode(uniqueCode);
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
        fontSize={20}
        outerBorderColor={'#000000'}
        outerBorderWidth={10}
        innerBorderColor={'#FFFFFF'}
        innerBorderWidth={5}
        radiusLineColor={'#FFFFFF'}
        radiusLineWidth={2}
        spinDuration={0.4}
        backgroundColors={['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124', '#D65076', '#45B8AC']}
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