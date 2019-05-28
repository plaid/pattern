import axios from 'axios';
import { toast } from 'react-toastify';

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
// This endoint is only availble in the sandbox enviornment
export const setItemToBadState = itemId =>
  api.post('/items/sandbox/item/reset_login', { itemId });

export const getPublicToken = id => api.post(`items/${id}/public_token`);

// accounts
export const getAccountsByItem = itemId => api.get(`/items/${itemId}/accounts`);
export const getAccountsByUser = userId => api.get(`/users/${userId}/accounts`);

// transactions
// export const getTransactionsByAccount = accountId =>
//   api.get(`/accounts/${accountId}/transactions`);
export const getTransactionsByAccount = accountId =>
  api.get(`/accounts/${accountId}/transactions`);
export const getTransactionsByItem = itemId =>
  api.get(`/items/${itemId}/transactions`);
export const getTransactionsByUser = userId =>
  api.get(`/users/${userId}/transactions`);

// institutions
export const getInstitutionById = instId => api.get(`/institutions/${instId}`);

// misc
export const getWebhookUrl = async () => {
  try {
    const res = await fetch('/services/ngrok');
    const { url: urlBase } = await res.json();

    return {
      data: urlBase ? `${urlBase}/services/webhook` : '',
    };
  } catch (err) {
    console.error('Error fetching webhook url');
    return { data: null };
  }
};

export const exchangeToken = async (
  publicToken,
  institution,
  accounts,
  userId
) => {
  const res = await fetch('/items', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      publicToken,
      institutionId: institution.institution_id,
      userId,
      accounts,
    }),
  });

  const resJson = await res.json();

  if (res.status === 409) {
    const errorMsg = `${institution.name} already linked.`;
    console.error(errorMsg);
    toast.error(errorMsg);
  } else if (resJson.error) {
    console.error(resJson.error);
    toast.error(`Error linking ${institution.name}`);
  }

  return resJson;
};
