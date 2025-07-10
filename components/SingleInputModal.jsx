import { View, Text, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import BuildInput from './BuildInput'
import TextButton from './TextButton'
import PopupModalBase from './PopupModalBase'




const SingleInputModal = ({isVisible, header, handleModalOpen, placeholder, submitButtonText, handleSubmit}) => {
  const [inputValue, setInputValue] = useState("")

  const changeValue = (value) => {
    setInputValue(value);
  } 

  const submitValue = async () => {

    if (!inputValue) {
      return;
    }
    
    try {
      await handleSubmit(inputValue)
    } catch (error) {
      console.log("Failed to submit SingleInputModal,", error)
    }
    await handleModalOpen()
    
  }

  const modalContent = () => {
    return (
      <View className='w-full p-4'>
        <View className='border-b-2 border-b-background-80 items-center'>
          <Text className="text-xl text-highlight">{header}</Text>
        </View>
        <View className="justify-center py-4">
          <BuildInput
            value={inputValue}
            handleChange={changeValue}
            placeholder={placeholder}
          />
        </View>
      </View>
    )
  }

  return (
    <PopupModalBase 
      isVisible={isVisible}
      handleCancel={handleModalOpen}
      handleSubmit={submitValue}
      submitButtonText={submitButtonText}
    >
      {modalContent()}
    </PopupModalBase>
  )
}

export default SingleInputModal