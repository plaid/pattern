import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';

import { DuplicateItemToastMessage } from '../components';

const baseURL = '/';

const api = axios.create({
  baseURL,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: 0,
  },
});

export default api;

// users
export const getUsers = () => api.get('/users');
export const getUserById = userId => api.get(`/users/${userId}`);
export const addNewUser = username => api.post('/users', { username });
export const deleteUserById = userId => api.delete(`/users/${userId}`);

// items
export const getItemById = id => api.get(`/items/${id}`);
export const getItemsByUser = userId => api.get(`/users/${userId}/items`);
export const deleteItemById = id => api.delete(`/items/${id}`);
export const setItemState = (itemId, status) =>
  api.put(`items/${itemId}`, { status });
// This endpoint is only availble in the sandbox enviornment
export const setItemToBadState = itemId =>
  api.post('/items/sandbox/item/reset_login', { itemId });

export const getPublicToken = id => api.post(`items/${id}/public_token`);
export const getLinkToken = ({userId, itemId}) => api.post(`/link-token`, {
  userId,
  itemId
});

// accounts
export const getAccountsByItem = itemId => api.get(`/items/${itemId}/accounts`);
export const getAccountsByUser = userId => api.get(`/users/${userId}/accounts`);

// transactions
export const getTransactionsByAccount = accountId =>
  api.get(`/accounts/${accountId}/transactions`);
export const getTransactionsByItem = itemId =>
  api.get(`/items/${itemId}/transactions`);
export const getTransactionsByUser = userId =>
  api.get(`/users/${userId}/transactions`);

// institutions
export const getInstitutionById = instId => api.get(`/institutions/${instId}`);

// misc
export const postLinkEvent = event => api.post(`/link-event`, event);

export const exchangeToken = async (
  publicToken,
  institution,
  accounts,
  userId
) => {
  try {
    const { data } = await api.post('/items', {
      publicToken,
      institutionId: institution.institution_id,
      userId,
      accounts,
    });
    return data;
  } catch (err) {
    const { response } = err;
    if (response && response.status === 409) {
      toast.error(
        <DuplicateItemToastMessage institutionName={institution.name} />
      );
    } else {
      toast.error(`Error linking ${institution.name}`);
    }
  }
};
