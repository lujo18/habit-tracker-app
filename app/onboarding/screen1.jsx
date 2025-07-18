import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import Header from "../../components/Text/Header";
import XLHeader from "../../components/Text/XLHeader";
import Subheader from "../../components/Text/Subheader";

const screen1 = () => {
  return (
    <SafeAreaView className="flex-1 flex w-full bg-background p-4 gap-4">
      <KeyboardAvoidingView
        className="flex justify-start items-center gap-4 w-full h-full flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="w-full justify-center items-center">
          <Header>NoRedo</Header>
        </View>
        <View className="flex-1 w-full items-center justify-center">
          <View className="mb-8 items-center gap-2">
            <XLHeader>Log Into Account</XLHeader>
            <Subheader>Enter your information to log in.</Subheader>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default screen1;
