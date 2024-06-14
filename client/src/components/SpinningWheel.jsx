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
    return storedValue ? storedValue : false;
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
      Cookies.set('prizeNumber', newPrizeNumber, { expires: 14 })
      setCurrentPrize(data[newPrizeNumber].option);
      setHasSpun(true);
      setMustSpin(true);
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 14);
      setExpiryDate(expiry);
    }
  };
  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={() => {
          setMustSpin(false);
          setShowResult(true);
          Cookies.set('expiryDate', expiryDate, { expires: 14 });
          Cookies.set('hasSpun', hasSpun, { expires: 14 });
          Cookies.set('currentPrize', currentPrize, { expires: 14 });
        }}
      />
      <button onClick={handleSpinClick} disabled={hasSpun ? true : false}>SPIN</button>

      {showResult && <>
        <h1>{currentPrize}</h1> <h2>Expires on: {expiryDate.toDateString()}</h2>
      </>}
    </>
  );
};

export default SpinningWheel;