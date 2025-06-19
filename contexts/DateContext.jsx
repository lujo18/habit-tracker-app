/*import { createContext } from "react";

export const DateContext = createContext(null);*/

import React, { createContext, useContext, useEffect, useState } from 'react';

const DateContext = createContext();

export const DateProvider = ({children}) => {
  const [selectedDate, setDate] = useState(null);

  if (!selectedDate) {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 1)
    currentDate.setHours(0, 0, 0, 0);
    setDate(currentDate)
  }

  const setSelectedDate = (date) => {setDate(date);}

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  )
}

export const useDateContext = () => {
  const context = useContext(DateContext)

  if (!context) {
    throw new Error("useLoading must be used within a DateProvider");
  }

  return context
};