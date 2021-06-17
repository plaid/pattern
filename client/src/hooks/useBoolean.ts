import { useState, useCallback } from 'react';

export default function useBoolean(initial: any) {
  const [state, setState] = useState(initial);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);
  const toggle = useCallback(() => {
    setState((prev: any) => !prev);
  }, []);

  return [state, setFalse, toggle];
}
