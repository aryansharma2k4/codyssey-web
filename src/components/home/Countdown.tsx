"use client";

import React, { useEffect, useState } from "react";

interface CountdownToEventProps {
  /** The event date in YYYY-MM-DD format (default: 2025-10-31) */
  targetDate?: string;
}

const CountdownToEvent: React.FC<CountdownToEventProps> = ({
  targetDate = "2025-10-31",
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("00d : 00h : 00m");

  useEffect(() => {
    const pad = (num: number): string => String(num).padStart(2, "0");

    const updateCountdown = () => {
      // Create target date as 10:00 AM IST (assuming local system is also in IST)
      const eventDate = new Date(`${targetDate}T14:20:00`);

      // If invalid date
      if (isNaN(eventDate.getTime())) {
        console.error("Invalid target date provided to CountdownToEvent");
        setTimeLeft("00d : 00h : 00m");
        return;
      }

      const now = new Date();

      // If event has already passed
      if (now >= eventDate) {
        setTimeLeft("00d : 00h : 00m");
        return;
      }

      const diff = eventDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60 * 1000); // update every minute
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <h1 className="text-5xl sm:text-8xl mt-4 font-extrabold text-transparent [-webkit-text-stroke:2px_gray]">
      {timeLeft}
    </h1>
  );
};

export default CountdownToEvent;
