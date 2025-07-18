import { View, Text } from 'react-native'
import React from 'react'

const BasicContainer = ({ children, className = '' }) => {
  return (
    <View className={`border-2 border-background-90 flex justify-start items-start p-4 rounded-xl w-full ${className}`}>
      {children}
    </View>
  )
}

export default BasicContainer