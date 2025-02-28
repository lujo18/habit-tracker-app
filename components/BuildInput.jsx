import { View, Text, TextInput } from 'react-native'
import React, { memo, useCallback } from 'react'

const BuildInput = ({value, handleChange, label, placeholder, inputStyles, ...props}) => {

  return (
    <View>
        {label && (<Text className="text-highlight-70">{label}</Text>)}
        <TextInput
            className={`border-background-80 border-2 p-4 text-highlight-90 ${inputStyles}`}
            value={value}
            onChangeText={handleChange} 
            placeholder={placeholder}
            textBreakStrategy='simple'
            {...props}
        />
    </View>
  )
} 

export default memo(BuildInput)