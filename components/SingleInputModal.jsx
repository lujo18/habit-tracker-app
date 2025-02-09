import { View, Text, Modal } from 'react-native'
import React, { useState } from 'react'
import BuildInput from './BuildInput'
import TextButton from './TextButton'


const SingleInputModal = ({isVisible, header, handleModalOpen, placeholder, submitValue, handleSubmit}) => {
  const [inputValue, setInputValue] = useState("")

  const changeValue = (e) => {
    setInputValue(e.value);
  } 

  return (
    <Modal animationType='fade' transparent={true} visible={isVisible}>
      <View className="w-full h-full justify-center items-center p-4 bg-black/70">
        <View className="bg-background-90 w-full h-[25vh] p-4 rounded-xl">
          <Text className="text-xl text-highlight-80">{header}</Text>
          <View className="flex-1 justify-center">
            <BuildInput 
              value={inputValue}
              handleChange={changeValue}
              placeholder={placeholder}
            />
          </View>
          <View className="flex-row gap-4 mb-3">
            <TextButton
              text="Cancel"
              onPress={handleModalOpen}
              containerStyles="flex-1 bg-background-80"
            />
            <TextButton
              text={submitValue}
              containerStyles={`flex-1 bg-habitColors-hBlue`}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default SingleInputModal