import { useCallback, useEffect, useRef } from "react";

export const useDebounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
) => {
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay],
  );

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return debouncedFunction;
};
