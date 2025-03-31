import { View, Text, TextInput } from 'react-native'
import React, { memo, useCallback } from 'react'

const BuildInput = ({value, handleChange, label, placeholder, inputStyles, ...props}) => {

  return (
    <View>
        {label && (<Text className="text-highlight-70">{label}</Text>)}
        <TextInput
            className={`border-b-2 border-background-80 text-xl p-5 text-highlight-90 ${inputStyles}`}
            value={value}
            onChangeText={handleChange} 
            placeholder={placeholder}
            placeholderTextColor={"#BFC6D4"}
            textBreakStrategy='simple'
            {...props}
        />
    </View>
  )
} 

export default memo(BuildInput)