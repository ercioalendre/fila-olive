// WaitingRoom.tsx
import React from 'react';
import { useUserWebSocket } from './WsUserContext';

const UserWaitingRoom: React.FC = () => {
  const { userPosition } = useUserWebSocket();

  return (
    <div className="waiting-room">
      <h2>Welcome to the Waiting Room</h2>
      {userPosition !== null ? <p>Your queue number: {userPosition}</p> : <p>Connecting...</p>}
      <p>Waiting for an operator to connect...</p>
    </div>
  );
};

export default UserWaitingRoom;
