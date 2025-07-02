import { View, Text } from 'react-native'
import React from 'react'

const Subheader = ({children}) => {
  return (
    
    <Text className='text-highlight-60 text-lg font-generalsans-medium'>{children}</Text>
    
  )
}

export default Subheader