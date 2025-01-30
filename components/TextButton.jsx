import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const TextButton = ({text, onPress, containerStyles, textStyles, specialStyles}) => {
  return (
    <TouchableOpacity onPress={onPress} className={`p-3 bg-background-80 min-h-[55px] justify-center items-center rounded-xl ${containerStyles}`} style={specialStyles}>
        <Text className={`text-highlight-90 text-lg ${textStyles}`}>{text}</Text>
    </TouchableOpacity>
  )
}

export default TextButton