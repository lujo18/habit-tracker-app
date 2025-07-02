import { View, Text } from 'react-native'
import React from 'react'

const Header = ({children}) => {
  return (
    <Text className='text-highlight text-xl font-generalsans-semibold'>{children}</Text>
  )
}

export default Header