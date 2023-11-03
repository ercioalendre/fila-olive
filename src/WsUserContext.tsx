import React, { createContext, useContext, useEffect, useState } from 'react';

interface WebSocketContextProps {
  children: React.ReactNode;
}

// Define a new interface that includes the userId property
interface WebSocketContextType {
  socket: WebSocket | null;
  userId?: string | null;
  userPosition?: number | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  userId: undefined,
  userPosition: undefined,
});

export const UserWebSocketProvider: React.FC<WebSocketContextProps & { userId?: string | null }> = ({ children, userId }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userPosition, setUserPosition] = useState<number | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:9876/user/${userId}`);

    newSocket.onopen = () => {
      console.log('WebSocket connected');
      if (userId) {
        newSocket.send(JSON.stringify({ type: 'userId', userId }));
      }
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'position') {
        setUserPosition(data.value);
      }

      if (data.type === 'redirect' && data.value) {
        window.location.href = `https://app-meet-olive.azurewebsites.net/${data.value}`;
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      // Handle disconnection if needed
    };

    setSocket(newSocket);

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [userId]);

  return <WebSocketContext.Provider value={{ socket, userId, userPosition }}>{children}</WebSocketContext.Provider>;
};

export const useUserWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  return context;
};
