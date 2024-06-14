import { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import Cookies from 'js-cookie';

const data = [
  { option: 'Free coffee' },
  { option: 'Free pasta' },
  { option: 'Free cola' },
];

const SpinningWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const [hasSpun, setHasSpun] = useState(() => {
    const storedValue = Cookies.get('hasSpun');
    return storedValue ? JSON.parse(storedValue) : false;
  });
  
  const [currentPrize, setCurrentPrize] = useState(() => {
    const storedPrize = Cookies.get('currentPrize');
    return storedPrize ? storedPrize : null;
  });

  useEffect(() => {
    if (hasSpun) {
      Cookies.set('hasSpun', JSON.stringify(hasSpun), { expires: 14 });
    }
  }, [hasSpun]);

  useEffect(() => {
    if (currentPrize) {
      Cookies.set('currentPrize', currentPrize, { expires: 14 });
    }
  }, [currentPrize]);

  const handleSpinClick = () => {
    if (!mustSpin && !hasSpun) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setCurrentPrize(data[newPrizeNumber].option);
      setMustSpin(true);
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
          setHasSpun(true);
        }}
      />
      <button onClick={handleSpinClick} disabled={hasSpun}>SPIN</button>

      {hasSpun && currentPrize ? <h1>{currentPrize}</h1> : false}
    </>
  );
};

export default SpinningWheel;