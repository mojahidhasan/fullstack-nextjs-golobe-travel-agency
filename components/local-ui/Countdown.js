import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function Countdown({
  currentTimeMs = 0,
  timeoutAtMs = 60000,
  className,
  ...props
}) {
  const interval = useRef();
  const [remainingTime, setRemainingTime] = useState(1);

  useEffect(() => {
    const currTime = +currentTimeMs || Date.now();
    setRemainingTime(+timeoutAtMs - currTime);
    const updateRemainingTime = () => {
      setRemainingTime((prev) => prev - 1000);
    };

    interval.current = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval.current);
  }, [timeoutAtMs, currentTimeMs]);

  if (remainingTime <= 0) {
    setRemainingTime(1);
    clearInterval(interval.current);
  }

  return (
    <div className={cn(className)} {...props}>
      {formatTimeFromMilliseconds(remainingTime)}
    </div>
  );
}
function formatTimeFromMilliseconds(ms) {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  if (hours > 0) {
    const formattedHours = String(hours).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedMinutes}:${formattedSeconds}`;
}
