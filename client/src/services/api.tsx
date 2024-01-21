import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';

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
// currentUser
export const getLoginUser = (username: string) =>
  api.post('/sessions', { username });

// assets
export const addAsset = (userId: number, description: string, value: number) =>
  api.post('/assets', { userId, description, value });
export const getAssetsByUser = (userId: number) => api.get(`/assets/${userId}`);
export const deleteAssetByAssetId = (assetId: number) =>
  api.delete(`/assets/${assetId}`);

// users
export const getUsers = () => api.get('/users');
export const getUserById = (userId: number) => api.get(`/users/${userId}`);
export const addNewUser = (username: string) =>
  api.post('/users', { username });
export const deleteUserById = (userId: number) =>
  api.delete(`/users/${userId}`);

// items
export const getItemById = (id: number) => api.get(`/items/${id}`);
export const getItemsByUser = (userId: number) =>
  api.get(`/users/${userId}/items`);
export const deleteItemById = (id: number) => api.delete(`/items/${id}`);
export const setItemState = (itemId: number, status: string) =>
  api.put(`items/${itemId}`, { status });
// This endpoint is only availble in the sandbox enviornment
export const setItemToBadState = (itemId: number) =>
  api.post('/items/sandbox/item/reset_login', { itemId });

export const getLinkToken = (userId: number, itemId: number) =>
  api.post(`/link-token`, {
    userId,
    itemId,
  });

// accounts
export const getAccountsByItem = (itemId: number) =>
  api.get(`/items/${itemId}/accounts`);
export const getAccountsByUser = (userId: number) =>
  api.get(`/users/${userId}/accounts`);

// transactions
export const getTransactionsByAccount = (accountId: number) =>
  api.get(`/accounts/${accountId}/transactions`);
export const getTransactionsByItem = (itemId: number) =>
  api.get(`/items/${itemId}/transactions`);
export const getTransactionsByUser = (userId: number) =>
  api.get(`/users/${userId}/transactions`);
export const setLabel = (id: number, newLabel: any) =>
  api.put(`/users/${id}/label`, { newLabel });

// institutions
export const getInstitutionById = (instId: string) =>
  api.get(`/institutions/${instId}`);

// misc
export const postLinkEvent = (event: any) => api.post(`/link-event`, event);

export const exchangeToken = async (
  publicToken: string,
  institution: any,
  accounts: PlaidLinkOnSuccessMetadata['accounts'],
  userId: number
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
    if (err && typeof err === 'object' && 'response' in err) {
      const response = (err as any).response;
      if (response && response.status === 409) {
        toast.error(
          <DuplicateItemToastMessage institutionName={institution.name} />
        );
      } else {
        toast.error(`Error linking ${institution.name}`);
      }
    } else {
      toast.error('An unknown error occurred');
    }
  }
};
