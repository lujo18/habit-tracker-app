import { View, Text, Modal } from "react-native";
import TextButton from "./TextButton";

const PopupModalBase = ({ isVisible, handleCancel, handleSubmit, submitButtonText, children }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View className="w-full h-full justify-center items-center p-4 bg-black/70">
        <View className="bg-background-90 w-full rounded-xl border-2 border-background-80 items-center justify-center">

          {children}
          
          <View className="flex-row gap-4 p-4">
            <TextButton
              text="Cancel"
              onPress={handleCancel}
              containerStyles="flex-1 bg-background-80"
            />
            <TextButton
              text={submitButtonText}
              containerStyles={`flex-1 bg-habitColors-hBlue`}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PopupModalBase;
