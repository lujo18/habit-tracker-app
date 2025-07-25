import { View, Text, TextInput, useColorScheme } from 'react-native'
import React, { memo, useCallback } from 'react'
import tailwindConfig from '../tailwind.config'

const tailwindColors = tailwindConfig.theme.extend.colors
const BuildInput = ({value, handleChange, label, placeholder, inputStyles, type = 'text', error, ...props}) => {
  const colorScheme = useColorScheme()

  const errorStyle = error ? (
    "border-habitColors-red"
  ) : (
    "border-background-80"
  )

  return (
    <View>
        {label && (<Text className="text-highlight-70">{label}</Text>)}
        <TextInput
            inputMode={type}
            className={`border-2 ${errorStyle} rounded-xl text-xl p-5 text-highlight font-generalsans-medium ${inputStyles}`}
            value={value}
            onChangeText={handleChange} 
            placeholder={placeholder}
            placeholderTextColor={tailwindColors['background'][60]}
            textBreakStrategy='simple'
            keyboardAppearance={colorScheme === 'dark' ? 'dark' : 'light'}
            {...props}
        />
    </View>
  )
} 

export default memo(BuildInput)
