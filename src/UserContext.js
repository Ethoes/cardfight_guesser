import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [currentRoomName, setCurrentRoomName] = useState('');
  const [currentRoomOwner, setRoomOwner] = useState('');

  return (
    <UserContext.Provider value={{ username, setUsername, currentRoomName, setCurrentRoomName, currentRoomOwner, setRoomOwner }}>
      {children}
    </UserContext.Provider>
  );
};