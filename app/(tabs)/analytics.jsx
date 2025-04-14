import { View, Text, SafeAreaView} from 'react-native'
import React from 'react'
import { DateContext } from '../../contexts/DateContext'


const Analytics = () => {
  return (
   
    <SafeAreaView className="bg-background h-full w-full px-4 flex-1">
      <View className="flex-row align-center  p-4">
        <View className="flex-1 items-center">
          <Text className="text-highlight text-2xl">Analytics</Text>
        </View>
      </View>
    </SafeAreaView>
    
  )
}

export default Analytics