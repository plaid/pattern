import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useCallback,
} from 'react';

import { getInstitutionById as apiGetInstitutionById } from './api';

const InstitutionsContext = createContext();

/**
 * @desc Enumerated action types
 */
const types = {
  SUCCESSFUL_GET: 0,
  // FAILED_GET: 1,
};

/**
 * @desc Maintains the Institutions context state and provides functions to update that state.
 */
export function InstitutionsProvider(props) {
  const [institutionsById, dispatch] = useReducer(reducer, {});

  const hasRequested = useRef({});

  /**
   * @desc Requests details for a single Institution.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getInstitutionById = useCallback(async (id, refresh) => {
    if (!hasRequested.current[id] || refresh) {
      hasRequested.current[id] = true;
      const { data: payload } = await apiGetInstitutionById(id);
      const institution = payload[0];
      dispatch([types.SUCCESSFUL_GET, institution]);
    }
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Institution data. useMemo will prevent
   * these from being rebuilt on every render unless institutionsById is updated in the reducer.
   */
  const value = useMemo(() => {
    const allInstitutions = Object.values(institutionsById);
    return {
      allInstitutions,
      institutionsById,
      getInstitutionById,
      getInstitutionsById: getInstitutionById,
      formatLogoSrc,
    };
  }, [institutionsById, getInstitutionById]);

  return <InstitutionsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Institutions state as dictated by dispatched actions.
 */
function reducer(state, [type, payload]) {
  switch (type) {
    case types.SUCCESSFUL_GET:
      if (!payload) {
        return state;
      }

      return {
        ...state,
        [payload.institution_id]: payload,
      };
    default:
      console.warn('unknown action: ', { type, payload });
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Institutions context state in components.
 */
export default function useInstitutions() {
  const context = useContext(InstitutionsContext);

  if (!context) {
    throw new Error(
      `useInstitutions must be used within an InstitutionsProvider`
    );
  }

  return context;
}

/**
 * @desc Prepends base64 encoded logo src for use in image tags
 */
function formatLogoSrc(src) {
  return src && `data:image/jpeg;base64,${src}`;
}
