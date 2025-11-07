import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useAccounts, useItems, useTransactions } from '../services';
const io = require('socket.io-client');
const { REACT_APP_SERVER_PORT } = process.env;

// Helper function to create webhook toast with ngrok inspector link
const showWebhookToast = (msg, type = 'default') => {
  const content = (
    <div>
      <div>{msg}</div>
      <div style={{ marginTop: '8px', fontSize: '0.9em', opacity: 0.8 }}>
        💡 View webhook details at{' '}
        <a
          href="http://localhost:4040"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          localhost:4040
        </a>
      </div>
    </div>
  );

  if (type === 'error') {
    toast.error(content);
  } else {
    toast(content);
  }
};

export default function Sockets() {
  const socket = useRef();
  const { getAccountsByItem } = useAccounts();
  const { getTransactionsByItem } = useTransactions();
  const { getItemById } = useItems();

  useEffect(() => {
    console.log('Connecting to socket server at port:', REACT_APP_SERVER_PORT);
    socket.current = io(`http://localhost:${REACT_APP_SERVER_PORT}`);

    socket.current.on('connect', () => {
      console.log('Socket connected successfully!');
    });

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.current.on('SYNC_UPDATES_AVAILABLE', ({ itemId } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Transactions updates`;
      console.log(msg);
      console.log('[SOCKET EVENT] SYNC_UPDATES_AVAILABLE received, fetching transactions for itemId:', itemId);
      showWebhookToast(msg);
      getAccountsByItem(itemId);
      getTransactionsByItem(itemId).then(() => {
        console.log('[SOCKET EVENT] Transactions fetched successfully for itemId:', itemId);
      }).catch(err => {
        console.error('[SOCKET EVENT] Error fetching transactions:', err);
      });
    });

    socket.current.on('ERROR', ({ itemId, errorCode } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Item Error ${errorCode}`;
      console.error(msg);
      showWebhookToast(msg, 'error');
      getItemById(itemId, true);
    });

    socket.current.on('PENDING_EXPIRATION', ({ itemId } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Access consent is expiring in 7 days. To prevent this, User should re-enter login credentials.`;
      console.log(msg);
      showWebhookToast(msg);
      getItemById(itemId, true);
    });

    socket.current.on('PENDING_DISCONNECT', ({ itemId } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Item will be disconnected in 7 days. To prevent this, User should re-enter login credentials.`;
      console.log(msg);
      showWebhookToast(msg);
      getItemById(itemId, true);
    });



    socket.current.on('NEW_TRANSACTIONS_DATA', ({ itemId } = {}) => {
      getAccountsByItem(itemId);
      getTransactionsByItem(itemId);
    });

    return () => {
      socket.current.removeAllListeners();
      socket.current.close();
    };
  }, [getAccountsByItem, getTransactionsByItem, getItemById]);

  return <div />;
}
