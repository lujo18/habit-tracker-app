import { View, Text, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import BuildInput from "./BuildInput";
import TextButton from "./TextButton";
import PopupModalBase from "./PopupModalBase";
import Header from "./Text/Header";

const SingleInputModal = ({
  children,
  isVisible,
  header,
  handleModalOpen,
  placeholder,
  submitButtonText,
  handleSubmit,
  disableIfNotEqualTo
}) => {
  const [inputValue, setInputValue] = useState("");

  const changeValue = (value) => {
    setInputValue(value);
  };

 
  const submitValue = async () => {
    if (!inputValue) {
      return;
    }

    try {
      await handleSubmit(inputValue);
    } catch (error) {
      console.log("Failed to submit SingleInputModal,", error);
    }
    await handleModalOpen();
  };

  const modalContent = () => {
    return (
      <View className="w-full p-4">
        {children ? (
          children
        ) : (
          <View className="items-center">
            <Header className="text-xl text-highlight">{header}</Header>
          </View>
        )}
        <View className="justify-center py-4">
          <BuildInput
            value={inputValue}
            handleChange={changeValue}
            placeholder={placeholder}
          />
        </View>
      </View>
    );
  };

  
  return (
    <PopupModalBase
      isVisible={isVisible}
      handleCancel={handleModalOpen}
      handleSubmit={submitValue}
      submitButtonText={submitButtonText}
      disabled={(!inputValue.match(disableIfNotEqualTo) || !inputValue)}
    >
      {modalContent()}
    </PopupModalBase>
  );
};

export default SingleInputModal;
