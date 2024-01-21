import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useAccounts, useItems, useTransactions } from '../services';
const io = require('socket.io-client');
const { REACT_APP_SERVER } = process.env;

export default function Sockets() {
  const socket = useRef();
  const { getAccountsByItem } = useAccounts();
  const { getTransactionsByItem } = useTransactions();
  const { getItemById } = useItems();

  useEffect(() => {
    socket.current = io(REACT_APP_SERVER);

    socket.current.on('SYNC_UPDATES_AVAILABLE', ({ itemId } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Transactions updates`;
      console.log(msg);
      toast(msg);
      getAccountsByItem(itemId);
      getTransactionsByItem(itemId);
    });

    socket.current.on('ERROR', ({ itemId, errorCode } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Item Error ${errorCode}`;
      console.error(msg);
      toast.error(msg);
      getItemById(itemId, true);
    });

    socket.current.on('PENDING_EXPIRATION', ({ itemId } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Access consent is expiring in 7 days. User should re-enter login credentials.`;
      console.log(msg);
      toast(msg);
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
