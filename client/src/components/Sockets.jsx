import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useAccounts, useItems, useTransactions } from '../services';
const io = require('socket.io-client');
const { REACT_APP_SERVER_PORT } = process.env;

export default function Sockets() {
  const socket = useRef();
  const { getAccountsByItem } = useAccounts();
  const { getTransactionsByItem } = useTransactions();
  const { getItemById } = useItems();

  useEffect(() => {
    socket.current = io(`localhost:${REACT_APP_SERVER_PORT}`);

    socket.current.on('DEFAULT_UPDATE', ({ itemId } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: New Transactions Received`;
      console.log(msg);
      toast(msg);
    });

    socket.current.on('TRANSACTIONS_REMOVED', ({ itemId } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Transactions Removed`;
      console.log(msg);
      toast(msg);
    });

    socket.current.on('INITIAL_UPDATE', ({ itemId } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Initial Transactions Received`;
      console.log(msg);
      toast(msg);
      getAccountsByItem(itemId);
      getTransactionsByItem(itemId);
    });

    socket.current.on('HISTORICAL_UPDATE', ({ itemId } = {}) => {
      const msg = `New Webhook Event: Item ${itemId}: Historical Transactions Received`;
      console.log(msg);
      toast(msg);
      getTransactionsByItem(itemId, true);
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

    return () => {
      socket.current.removeAllListeners();
      socket.current.close();
    };
  }, [getAccountsByItem, getTransactionsByItem, getItemById]);

  return <div />;
}
