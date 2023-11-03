import React from 'react';
import { useOperatorWebSocket } from './WsOperatorContext';

const OperatorManagementRoom: React.FC = () => {
  const { operatorId, userQueue, socket } = useOperatorWebSocket(); // Destructure the 'socket' from the context object

  const handleOpenChatClick = (userId: string) => {
    if (operatorId && userId && socket) {
      const message = {
        type: 'openChatWindow',
        userId: userId,
      };

      socket.send(JSON.stringify(message));

      window.open(`https://app-meet-olive.azurewebsites.net/${userId}`, '_blank');
    }
  };

  const queueArray = userQueue ? Array.from(userQueue) : [];

  return (
    <div className="operator-room">
      <h2>Operator Room</h2>
      <p>Your operator ID: {operatorId}</p>
      <ul>
        {queueArray.map((user) => (
          <li key={user.key}>
            User ID: {user.key}, Position: {user.position}{' '}
            <button onClick={() => handleOpenChatClick(user.key)}>Open Chat</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OperatorManagementRoom;
