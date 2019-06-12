import { useEffect, useRef } from 'react';

export default function useOnClickOutside({ callback, ignoreRef }) {
  const ref = useRef();

  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      if (!ignoreRef.current || ignoreRef.current.contains(event.target)) {
        return;
      }

      callback(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [callback, ignoreRef]);

  return ref;
}
