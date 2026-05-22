import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const responseCallbacks = useRef(new Map());

  useEffect(() => {
    const socket = io('/', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err) => {
      console.error('Socket connect_error:', err.message || err);
    });
    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    socket.on('chatgpt-response', (response) => {
      responseCallbacks.current.forEach((cb) => cb(response));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = useCallback((chatId, content) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('chatgpt-ai', { chat: chatId, content });
    }
  }, []);

  const onResponse = useCallback((callback) => {
    const id = Date.now().toString();
    responseCallbacks.current.set(id, callback);
    return () => responseCallbacks.current.delete(id);
  }, []);

  return (
    <SocketContext.Provider value={{ connected, sendMessage, onResponse }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);