import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const TextButton = ({text, onPress, containerStyles, textStyles, specialStyles, type, disabled}) => {
  let buttonClass = '';
  let buttonStyle = specialStyles;
  let textClass = '';

  switch (type) {
    case 'solid':
      buttonClass = `p-3 flex-1 ${disabled ? 'bg-background-80' : 'bg-highlight-90'} min-h-[55px] justify-center items-center rounded-xl`;
      textClass = 'text-background-100 text-lg font-generalsans-medium';
      break;
    case 'outline':
      buttonClass = `p-3 flex-1 border-2 ${disabled ? 'border-background-80' : 'border-highlight-90'} min-h-[55px] justify-center items-center rounded-xl`;
      textClass = `${disabled ? 'text-background-80' : 'text-highlight-90'} text-lg font-generalsans-medium`;
      break;
    case 'custom':
    default:
      buttonClass = `p-3 flex-1 bg-background-80 min-h-[55px] justify-center items-center rounded-xl ${containerStyles}`;
      textClass = `text-highlight-90 text-lg font-generalsans-medium ${textStyles}`;
      break;
  }

  return (
    <TouchableOpacity onPress={onPress} className={buttonClass} style={buttonStyle} disabled={disabled}>
      <Text className={textClass}>{text}</Text>
    </TouchableOpacity>
  );
}

export default TextButton