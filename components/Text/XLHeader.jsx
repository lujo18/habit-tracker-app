import { View, Text } from 'react-native'
import React from 'react'

const XLHeader = ({children}) => {
  return (
    <Text className='text-highlight text-3xl font-generalsans-semibold'>{children}</Text>
  )
}

export default XLHeader