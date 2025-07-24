import { View, Text } from 'react-native'
import React from 'react'

const XLHeader = ({ children, className }) => {
  return (
    <Text className={`text-highlight text-3xl font-generalsans-semibold ${className || ''}`}>
      {children}
    </Text>
  )
}

export default XLHeader