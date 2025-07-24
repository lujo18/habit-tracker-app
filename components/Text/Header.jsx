import { View, Text } from 'react-native'
import React from 'react'

const Header = ({children, className}) => {
  return (
    <Text className={`text-highlight text-xl font-generalsans-semibold ${className || ''}`}>{children}</Text>
  )
}

export default Header