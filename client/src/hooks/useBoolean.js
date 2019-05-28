import { useState, useCallback } from 'react';

export default function useBoolean(initial) {
  const [state, setState] = useState(initial);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);
  const setFalse = useCallback(() => {
    setState(false);
  }, []);
  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);

  return [state, setTrue, setFalse, toggle];
}
