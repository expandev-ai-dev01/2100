import { useState, useEffect, useRef } from 'react';

export function useIdle(timeout: number) {
  const [isIdle, setIsIdle] = useState(false);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (isIdle) {
        setIsIdle(false);
      }
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    const intervalId = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= timeout) {
        if (!isIdle) {
          setIsIdle(true);
        }
      }
    }, 1000);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(intervalId);
    };
  }, [timeout, isIdle]);

  return isIdle;
}
