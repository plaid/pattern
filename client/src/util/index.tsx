import { distanceInWords, parse } from 'date-fns';

import { postLinkEvent as apiPostLinkEvent } from '../services/api';

/**
 * @desc small helper for pluralizing words for display given a number of items
 */
export function pluralize(noun, count) {
  return count === 1 ? noun : `${noun}s`;
}

/**
 * @desc converts number values into $ currency strings
 */
export function currencyFilter(value) {
  if (typeof value !== 'number') {
    return '-';
  }

  const isNegative = value < 0;
  const displayValue = value < 0 ? -value : value;
  return `${isNegative ? '-' : ''}$${displayValue
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,')}`;
}

const months = [
  null,
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * @desc Returns formatted date.
 */
export function formatDate(timestamp) {
  if (timestamp) {
    // slice will return the first 10 char(date)of timestamp
    // coming in as: 2019-05-07T15:41:30.520Z
    const [y, m, d] = timestamp.slice(0, 10).split('-');
    return `${months[+m]} ${d}, ${y}`;
  }

  return '';
}

/**
 * @desc Checks the difference between the current time and a provided time
 */
export function diffBetweenCurrentTime(timestamp) {
  return distanceInWords(new Date(), parse(timestamp), {
    addSuffix: true,
    includeSeconds: true,
  }).replace(/^(about|less than)\s/i, '');
}

enum PlaidLinkStableEvent {
  OPEN = 'OPEN',
  EXIT = 'EXIT',
  HANDOFF = 'HANDOFF',
  SELECT_INSTITUTION = 'SELECT_INSTITUTION',
  ERROR = 'ERROR',
}

interface PlaidLinkOnEventMetadata {
  error_type: null | string;
  error_code: null | string;
  error_message: null | string;
  exit_status: null | string;
  institution_id: null | string;
  institution_name: null | string;
  institution_search_query: null | string;
  mfa_type: null | string;
  // see possible values for view_name at https://plaid.com/docs/link/web/#link-web-onevent-view-name
  view_name: null | string;
  // see possible values for selection at https://plaid.com/docs/link/web/#link-web-onevent-selection
  selection: null | string;
  // ISO 8601 format timestamp
  timestamp: string;
  link_session_id: string;
  request_id: string;
}

type PlaidLinkOnEvent = (
  // see possible values for eventName at
  // https://plaid.com/docs/link/web/#link-web-onevent-eventName.
  // Events other than stable events are informational and subject to change,
  // and therefore should not be used to customize your product experience.
  eventName: PlaidLinkStableEvent | string,
  metadata: PlaidLinkOnEventMetadata
) => void;

export const logEvent = (eventName, metadata) => {
  console.log(`Link Event: ${eventName}`, metadata);
};

export const logSuccess = async (
  { institution, accounts, link_session_id },
  userId
) => {
  logEvent('onSuccess', {
    institution,
    accounts,
    link_session_id,
  });
  await apiPostLinkEvent({
    userId,
    link_session_id,
    type: 'success',
  });
};

export const logExit = async (
  error,
  { institution, status, link_session_id, request_id },
  userId
) => {
  logEvent('onExit', {
    error,
    institution,
    status,
    link_session_id,
    request_id,
  });
  const eventError = error || {};
  await apiPostLinkEvent({
    userId,
    link_session_id,
    request_id,
    type: 'exit',
    ...eventError,
    status,
  });
};
