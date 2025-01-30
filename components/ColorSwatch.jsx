import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ColorSwatch = ({ color, setColor, isSelected }) => {
  return (
    <TouchableOpacity onPress={() => {setColor(color)}} className={`${isSelected ? "border-2 border-highlight-90" : ""} w-14 h-14 rounded-xl`} style={{backgroundColor: color}}>

    </TouchableOpacity>
  )
}

export default ColorSwatch