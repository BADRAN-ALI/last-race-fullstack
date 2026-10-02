



import { useEffect, useRef, useState } from 'react';


export function useCountdown(seconds, onExpire, active = true) {
  const [remaining, setRemaining] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  const firedRef = useRef(false);



  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => {
      setRemaining((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (remaining === 0 && !firedRef.current) {
      firedRef.current = true;
      onExpireRef.current();
    }
  }, [remaining]);

  return remaining;
}
