import { useState, useCallback } from 'react';

export default function useBoolean(initial) {
  const [state, setState] = useState(initial);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);
  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);

  return [state, setFalse, toggle];
}
