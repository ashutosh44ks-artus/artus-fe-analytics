import { useEffect, useState } from "react";

const TIME_LIMIT = 300; // 5 minutes in seconds

const useTimeLeft = () => {
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  // Cooldown time for retrying
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const resetTimeLeft = () => {
    setTimeLeft(TIME_LIMIT);
  };

  return {
    timeLeft,
    resetTimeLeft,
  };
};

export default useTimeLeft;
