import React, { useEffect, useRef } from 'react';

interface Props {
  callback: () => void;
  ignoreRef: React.RefObject<HTMLDivElement>;
}

export default function useOnClickOutside(props: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      if (
        !props.ignoreRef.current ||
        props.ignoreRef.current.contains(event.target)
      ) {
        return;
      }

      props.callback();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [props.callback, props.ignoreRef]);

  return ref;
}
