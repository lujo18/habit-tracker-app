// contexts/HabitUpdateContext.jsx
import React, { createContext, useState, useContext } from 'react';

const HabitUpdateContext = createContext();

export const HabitUpdateProvider = ({ children }) => {
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(Date.now());

  const triggerUpdate = () => setLastUpdateTimestamp(Date.now());

  return (
    <HabitUpdateContext.Provider value={{ lastUpdateTimestamp, triggerUpdate }}>
      {children}
    </HabitUpdateContext.Provider>
  );
};

export const useHabitUpdate = () => useContext(HabitUpdateContext);