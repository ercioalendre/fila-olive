import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { OperatorWebSocketProvider } from './WsOperatorContext';
import { UserWebSocketProvider } from './WsUserContext';
import UserWaitingRoom from './UserWaitingRoom';
import OperatorManagementRoom from './OperatorManagementRoom';

const OperatorRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <OperatorWebSocketProvider operatorId={id}>
      <div className="App">
        <OperatorManagementRoom />
      </div>
    </OperatorWebSocketProvider>
  );
};

const UserRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <UserWebSocketProvider userId={id}>
      <div className="App">
        <UserWaitingRoom />
      </div>
    </UserWebSocketProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/:id" element={<UserRoom />} />
        <Route path="/operator/:id" element={<OperatorRoom />} />
      </Routes>
    </Router>
  );
};

export default App;
