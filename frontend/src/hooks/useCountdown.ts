import { useEffect, useState } from "react";

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diffToParts(diffMs: number): CountdownParts {
  const clamped = Math.max(diffMs, 0);
  const totalSeconds = Math.floor(clamped / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function useCountdown(targetDate: string): CountdownParts {
  const target = new Date(targetDate).getTime();
  const [parts, setParts] = useState<CountdownParts>(() =>
    diffToParts(target - Date.now()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setParts(diffToParts(target - Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return parts;
}
