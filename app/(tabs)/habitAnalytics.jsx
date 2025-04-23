import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'

const habitAnalytics = () => {
  const data = useLocalSearchParams()
  const router = useRouter()
  return (
    <SafeAreaView className="w-full h-full bg-background-90">
      <View className='p-4'>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className='text-white'>BACK</Text>
        </TouchableOpacity>
      </View>
      <View className='flex-1 bg-background'>
        <Text className="text-2xl text-white">{data.name}</Text>
        <Link href="/home" className='text-blue-500 mt-5'>Testing</Link>
      </View>
    </SafeAreaView>
  )
}

export default habitAnalytics