import { View, Text, TextInput, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { memo, useCallback, useRef, useState } from 'react'
import { Keyboard } from 'react-native';

const LargeTextInput = ({value, handleChange, label, placeholder, inputStyles, isScrolling, ...props}) => {

  const ref = useRef()
  
  return (
    
        <TextInput
          ref={ref}
          className={`text-highlight-90 text-xl flex-1 bg-background-90 ${inputStyles}`}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={"#BFC6D4"}
          editable={!isScrolling || (ref.current && ref.current.isFocused())}
          multiline
          textAlignVertical='top'
          scrollEnabled={false}
          bounces
          {...props}
        />
    
  )
}

export default memo(LargeTextInput)