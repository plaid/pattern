import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useAccounts, useItems } from '../services';
const io = require('socket.io-client');
const { REACT_APP_SERVER_PORT } = process.env;

const Sockets = () => {
  const socket = useRef();
  const { getAccountsByItem } = useAccounts();
  const { getItemById } = useItems();

  useEffect(() => {
    socket.current = io(`localhost:${REACT_APP_SERVER_PORT}`);

    socket.current.on('ERROR', ({ itemId, errorCode } = {}) => {
      const msg = `Item ${itemId}: Item Error ${errorCode}`;
      console.error(msg);
      toast.error(msg);
      getItemById(itemId, true);
    });

    socket.current.on('PENDING_EXPIRATION', ({ itemId } = {}) => {
      const msg = `Item ${itemId}: Access consent is expiring in 7 days. User should re-enter login credentials.`;
      console.log(msg);
      toast(msg);
      getItemById(itemId, true);
    });

    return () => {
      socket.current.removeAllListeners();
      socket.current.close();
    };
  }, [getAccountsByItem, getItemById]);

  return <div />;
};

Sockets.displayName = 'Sockets';
export default Sockets;
