'use client';

import React, { useEffect, useState } from 'react';

interface CountdownToEventProps {
  /** The event date in YYYY-MM-DD format (default: 2025-10-31) */
  targetDate?: string;
}

const CountdownToEvent: React.FC<CountdownToEventProps> = ({
  targetDate = '2025-10-31',
}) => {
  // Updated initial state to include seconds
  const [timeLeft, setTimeLeft] = useState<string>('00h : 00m : 00s');

  useEffect(() => {
    const pad = (num: number): string => String(num).padStart(2, '0');

    const updateCountdown = () => {
      // Create target date as 16:00 (4:00 PM) in the local timezone
      const eventDate = new Date(`${targetDate}T16:05:00`);

      // If invalid date
      if (isNaN(eventDate.getTime())) {
        console.error('Invalid target date provided to CountdownToEvent');
        // Updated "event passed" state
        setTimeLeft('00d : 00h : 00m : 00s');
        return;
      }

      const now = new Date();

      // If event has already passed
      if (now >= eventDate) {
        // Updated "event passed" state
        setTimeLeft('00d : 00h : 00m : 00s');
        return;
      }

      const diff = eventDate.getTime() - now.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      // --- 1. Calculate seconds ---
      const seconds = Math.floor((diff / 1000) % 60);

      // --- 2. Update the state string to include seconds ---
      setTimeLeft(
        `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`
      );
    };

    updateCountdown(); // Run once immediately
    // --- 3. Change interval to run every second (1000ms) ---
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <h1 className="text-5xl sm:text-8xl mt-4 font-extrabold text-transparent [-webkit-text-stroke:2px_gray]">
      {timeLeft}
    </h1>
  );
};

export default CountdownToEvent;
