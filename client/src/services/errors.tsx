import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
  ReactNode,
} from 'react';

interface ErrorsState {
  code?: string;
  message?: string;
}

const initialState: ErrorsState = {};
type ErrorsAction =
  | {
      type: 'SET_ERROR';
      payload: ErrorsState;
    }
  | {
      type: 'RESET_ERROR';
      payload: ErrorsState;
    };

interface ErrorsContextShape extends ErrorsState {
  dispatch: Dispatch<ErrorsAction>;
  setError: (code: string, message: string | null) => void;
  error: { code: string; message: string };
  resetError: () => void;
}
const ErrorsContext = createContext<ErrorsContextShape>(
  initialState as ErrorsContextShape
);

/**
 * @desc Maintains the Errors context state and provides functions to update that state.
 */
export const ErrorsProvider: React.FC<{ children: ReactNode }> = (
  props: any
) => {
  const [error, dispatch] = useReducer(reducer, initialState);

  /**
   * @desc Sets error from onEvent callback.
   */
  const setError = useCallback(async (code: string, message: string) => {
    dispatch({
      type: 'SET_ERROR',
      payload: { code: code, message: message },
    });
  }, []);

  /**
   * @desc resets error from onSuccess callback.
   */
  const resetError = useCallback(async () => {
    dispatch({
      type: 'RESET_ERROR',
      payload: {},
    });
  }, []);

  /**
   * @desc  useMemo will prevent error
   *  from being rebuilt on every render unless error is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      setError,
      error,
      resetError,
    };
  }, [setError, error, resetError]);

  return <ErrorsContext.Provider value={value} {...props} />;
};

/**
 * @desc Handles updates to the Errors state as dictated by dispatched actions.
 */
function reducer(state: ErrorsState, action: ErrorsAction) {
  switch (action.type) {
    case 'SET_ERROR':
      if (action.payload == null) {
        return state;
      }
      return {
        code: action.payload.code,
        message: action.payload.message,
      };
    case 'RESET_ERROR':
      return {};

    default:
      console.warn('unknown action');
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Errors context state in components.
 */
export default function useErrors() {
  const context = useContext(ErrorsContext);

  if (!context) {
    throw new Error(`useErrorsmust be used within an ErrorsProvider`);
  }

  return context;
}
