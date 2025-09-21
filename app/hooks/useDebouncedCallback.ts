import { useRef, useCallback, useEffect } from "react";

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void | Promise<void>,
  delay: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const debouncedFn = useCallback(
    (...args: Args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedFn;
}
