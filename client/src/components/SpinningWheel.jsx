import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import Cookies from 'js-cookie';

const data = [
  { option: 'Free coffee' },
  { option: 'Free pasta' },
  { option: 'Free cola' },
];

const SpinningWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  
  const [prizeNumber, setPrizeNumber] = useState(() => {
    const storedPrizeNumber = Cookies.get('prizeNumber');
    return storedPrizeNumber ? Number(storedPrizeNumber) : 0;
  });

  const [showResult, setShowResult] = useState(() => {
    const activeCookie = Cookies.get('currentPrize');
    return activeCookie ? true : false;
  });
  
  const [hasSpun, setHasSpun] = useState(() => {
    const storedValue = Cookies.get('hasSpun');
    return storedValue === 'true'; // Convert string to boolean
  });

  const [currentPrize, setCurrentPrize] = useState(() => {
    const storedPrize = Cookies.get('currentPrize');
    return storedPrize ? storedPrize : null;
  });

  const [expiryDate, setExpiryDate] = useState(() => {
    const storedExpiryDate = Cookies.get('expiryDate');
    return storedExpiryDate ? new Date(storedExpiryDate) : null;
  });

  const handleSpinClick = () => {
    if (!mustSpin && !hasSpun) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setCurrentPrize(data[newPrizeNumber].option);
      setMustSpin(true);
      setHasSpun(true);
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 14);
      setExpiryDate(expiry);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setShowResult(true);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 14);
    Cookies.set('prizeNumber', prizeNumber, { expires: 14 });
    Cookies.set('expiryDate', expiry.toISOString(), { expires: 14 });
    Cookies.set('hasSpun', 'true', { expires: 14 });
    Cookies.set('currentPrize', currentPrize, { expires: 14 });
  };

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={handleStopSpinning}
      />
      <button onClick={handleSpinClick} disabled={hasSpun}>SPIN</button>

      {showResult && (
        <>
          <h1>{currentPrize}</h1>
          {expiryDate && <h2>Expires on: {expiryDate.toDateString()}</h2>}
        </>
      )}
    </>
  );
};

export default SpinningWheel;
