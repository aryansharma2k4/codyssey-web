'use client';

import React, { useState } from 'react';

interface CountdownToEventProps {
  /** The event date in YYYY-MM-DD format (default: 2025-10-31) */
  targetDate?: string;
}

const CountdownToEvent: React.FC<CountdownToEventProps> = ({
  targetDate = '2025-10-31',
}) => {
  // 1. Set the initial state to the desired "stuck" time.
  // The format "00h : 05m : 00s" matches the original component's output.
  const [timeLeft, setTimeLeft] = useState<string>('00h : 05m : 00s');

  // 2. The useEffect hook has been removed.
  // This prevents the component from ever updating or changing the time.

  return (
    <h1 className="text-5xl sm:text-8xl mt-4 font-extrabold text-transparent [-webkit-text-stroke:2px_gray]">
      {timeLeft}
    </h1>
  );
};

export default CountdownToEvent;

