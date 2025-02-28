import { View, Text, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { memo, useCallback, useRef } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const LargeTextInput = ({value, handleChange, label, placeholder, inputStyles, ...props}) => {
  
  return (
    <View style={{flex: 1}}>
      <TextInput
          className={`text-highlight-90 px-6 flex-1 ${inputStyles}`}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          multiline
          textAlignVertical='top'
          
          {...props}
      />
    </View>
  )
} 

export default memo(LargeTextInput)