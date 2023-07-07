import React, { useState } from 'react';

const TimePeriodButtons = ({ periods, onPeriodChange }) => {
  const [activePeriod, setActivePeriod] = useState(periods[0]);

  const handleClick = (period) => {
    setActivePeriod(period);
    onPeriodChange(period);
  };

  return (
    <div className="button-group">
      {periods.map((period) => (
        <button
          key={period}
          className={period === activePeriod ? 'active' : ''}
          onClick={() => handleClick(period)}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default TimePeriodButtons;