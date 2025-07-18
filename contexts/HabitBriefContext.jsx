import { View, Text } from 'react-native'
import React, { createContext, useContext, useState } from 'react'

const HabitBriefContext = createContext()

export const HabitBriefProvider = ({children}) => {
  const [habitBriefContent, setHabitBriefContent] = useState([])

  const addToBrief = (data) => {
    setHabitBriefContent((prev) => [...prev, data])
  }

  return (
    <HabitBriefContext.Provider value={{habitBriefContent, addToBrief}}>
      {children}
    </HabitBriefContext.Provider>
  )
}

export const useHabitBrief = () => useContext(HabitBriefContext)