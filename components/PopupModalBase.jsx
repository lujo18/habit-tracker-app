import { View, Text, Modal, KeyboardAvoidingView, Platform } from "react-native";
import TextButton from "./TextButton";

const PopupModalBase = ({ isVisible, handleCancel, handleSubmit, submitButtonText, children }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View className="w-full h-full justify-center items-center p-4 bg-black/70">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%" }}
         
        >
          <View className="bg-background w-full rounded-xl border-2 border-background-90 items-center justify-center">

            {children}
            
            <View className="flex-row gap-4 p-4">
              <TextButton
                text="Cancel"
                type={"outline"}
                onPress={handleCancel}
              />
              <TextButton
                text={submitButtonText}
                type={"solid"}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PopupModalBase;
