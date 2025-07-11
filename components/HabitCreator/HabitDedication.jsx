import { View, Text, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Text/Header'
import XLHeader from '../Text/XLHeader'
import Subheader from '../Text/Subheader'
import BuildInput from '../BuildInput'

const char = " "
const HabitDedication = ({setOathSigned}) => {
  
  const [signature, setSignature] = useState("")

  const [fillInName, setFillInName] = useState("")

  const changeSignature = (value) => {
    setSignature(value)

    if (value.length > 0) {
      setOathSigned(true)
    }
    else {
      setOathSigned(false)
    }
  }

  useEffect(() => {
    
    setFillInName(" " + signature + char.repeat(Math.max(15 - signature.length, 1)))

  }, [signature])

  return (
    <View className='flex'>
      <XLHeader>Sign the NoRedo Oath</XLHeader>
      <Subheader>I, <Text className='underline'>{fillInName}</Text>,</Subheader>
      <Subheader>choose this habit not just for today,</Subheader>
      <Subheader>but for the person I refuse to die without becoming.</Subheader>
      <Subheader></Subheader>
      <Subheader>I will show up — tired, busy, uninspired — because comfort kills progress.</Subheader>
      <Subheader>I will persist — because each time I do, I cast a vote against regret.</Subheader>
      <Subheader></Subheader>
      <Subheader>This is not a challenge.</Subheader>
      <Subheader>It’s a declaration.</Subheader>
      <Subheader></Subheader>
      <Subheader>There is <Header>no redo.</Header></Subheader>
      <Subheader>Only now. Only forward.</Subheader>
      <Subheader></Subheader>
      <Text className='text-highlight text-xl font-generalsans-regular-italic italic'>#DeathToRegret</Text>
      <View className='flex-1 pb-4'>
        <BuildInput placeholder={"Sign here"} value={signature} handleChange={changeSignature} />
      </View>
      
    </View>
  )
}

export default HabitDedication