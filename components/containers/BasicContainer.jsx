import { View, Text } from 'react-native'
import React from 'react'

const BasicContainer = ({children}) => {
  return (
    <View className='border-2 border-background-90 flex flex-1 p-4 rounded-xl'>
      {children}
    </View>
  )
}

export default BasicContainer