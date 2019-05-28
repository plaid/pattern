import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

import { useAccounts, useItems, useTransactions } from '../services';

const { REACT_APP_SERVER_PORT } = process.env;

export default function Sockets() {
  const socket = useRef();
  const { getAccountsByItem } = useAccounts();
  const { getTransactionsByItem } = useTransactions();
  const { getItemById } = useItems();

  useEffect(() => {
    socket.current = io(`localhost:${REACT_APP_SERVER_PORT}`);

    socket.current.on('DEFAULT_UPDATE', ({ message, itemId } = {}) =>
      console.log(message, itemId)
    );

    socket.current.on('TRANSACTIONS_REMOVED', ({ message, itemId } = {}) =>
      console.log(message, itemId)
    );

    socket.current.on('INITIAL_UPDATE', ({ message, itemId } = {}) => {
      console.log(message);
      toast('New Webhook Event:\nInitial Transactions Received');
      getAccountsByItem(itemId);
      getTransactionsByItem(itemId);
    });

    socket.current.on('HISTORICAL_UPDATE', ({ message, itemId } = {}) => {
      console.log(message);
      toast('New Webhook Event:\nHistorical Transactions Received');
      getTransactionsByItem(itemId, true);
    });

    socket.current.on('ERROR', ({ message, itemId, errorCode } = {}) => {
      console.log(message);
      toast.error(`New Webhook Event:\nItem Error ${errorCode}`);
      getItemById(itemId, true);
    });

    return () => {
      socket.current.removeAllListeners();
      socket.current.close();
    };
  }, [getAccountsByItem, getTransactionsByItem, getItemById]);

  return <div />;
}
