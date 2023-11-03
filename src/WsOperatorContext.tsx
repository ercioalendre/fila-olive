import React, { createContext, useContext, useEffect, useState } from 'react';

interface WebSocketContextProps {
  children: React.ReactNode;
}

interface WebSocketUserContextType {
  socket: WebSocket | null;
  operatorId?: string | null;
  userQueue?: UserQueueOrderedList[] | null;
}

interface UserQueueOrderedList {
  key: string,
  position: string
}

const WebSocketContext = createContext<WebSocketUserContextType>({
  socket: null,
  operatorId: undefined,
  userQueue: undefined,
});

export const OperatorWebSocketProvider: React.FC<WebSocketContextProps & { operatorId?: string | null }> = ({ children, operatorId }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userQueue, setUserQueue] = useState<UserQueueOrderedList[] | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:9876/operator/${operatorId}`);

    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'userQueue') {
        setUserQueue(data.value);
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    setSocket(newSocket);

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [operatorId]);

  return <WebSocketContext.Provider value={{ socket, operatorId, userQueue }}>{children}</WebSocketContext.Provider>;
};

export const useOperatorWebSocket = (): WebSocketUserContextType => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  return context;
};
