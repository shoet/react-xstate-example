import { useEffect, useRef } from "react";

export const useTimer = (props: { cb: () => void; intervalMS: number }) => {
  const { intervalMS } = props;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const started = useRef<number | null>(null);
  const pauseRest = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    cleanup();

    started.current = Date.now();
    timerRef.current = setInterval(() => {
      props.cb();
    }, intervalMS);
  };

  const pause = () => {
    if (started.current) {
      pauseRest.current = Date.now() - started.current;
      cleanup();
      timeoutRef.current = setTimeout(() => {
        start();
      }, pauseRest.current);
    }
  };

  const reset = () => {
    cleanup();
  };

  const cleanup = () => {
    started.current = null;
    pauseRest.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return {
    start,
    pause,
    reset,
  };
};
