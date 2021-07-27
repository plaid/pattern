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
type ErrorsAction = {
  type: 'SUCCESSFUL_GET';
  payload: ErrorsState;
};

interface ErrorsContextShape extends ErrorsState {
  dispatch: Dispatch<ErrorsAction>;
  setError: (code: string, institution: string | null) => void;
  error: { code: string; institution: string };
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
      type: 'SUCCESSFUL_GET',
      payload: { code: code, institution: institution },
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
    };
  }, [setError, error]);

  return <ErrorsContext.Provider value={value} {...props} />;
};

/**
 * @desc Handles updates to the Accounts state as dictated by dispatched actions.
 */
function reducer(state: ErrorsState, action: ErrorsAction) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (action.payload == null) {
        return state;
      }
      return {
        code: action.payload.code,
        institution: action.payload.institution,
      };

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
