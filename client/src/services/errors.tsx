import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
  ReactNode,
} from 'react';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import { AccountType } from '../components/types';

import {
  getAccountsByItem as apiGetAccountsByItem,
  getAccountsByUser as apiGetAccountsByUser,
} from './api';

interface ErrorsState {
  code?: string;
  institution?: string;
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
  setError: (code: string, institution: string | null) => void;
  error: { code: string; institution: string };
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
   * @desc Requests all Accounts that belong to an individual Item.
   */
  const setError = useCallback(async (code: string, institution: string) => {
    dispatch({
      type: 'SET_ERROR',
      payload: { code: code, institution: institution },
    });
  }, []);

  const resetError = useCallback(async () => {
    dispatch({
      type: 'RESET_ERROR',
      payload: {},
    });
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Accounts data. useMemo will prevent
   * these from being rebuilt on every render unless accountsById is updated in the reducer.
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
 * @desc Handles updates to the Accounts state as dictated by dispatched actions.
 */
function reducer(state: ErrorsState, action: ErrorsAction) {
  switch (action.type) {
    case 'SET_ERROR':
      if (action.payload == null) {
        return state;
      }
      return {
        code: action.payload.code,
        institution: action.payload.institution,
      };
    case 'RESET_ERROR':
      return {};

    default:
      console.warn('unknown action');
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Accounts context state in components.
 */
export default function useErrors() {
  const context = useContext(ErrorsContext);

  if (!context) {
    throw new Error(`useErrorsmust be used within an ErrorsProvider`);
  }

  return context;
}
