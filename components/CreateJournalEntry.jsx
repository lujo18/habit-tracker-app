import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import TextButton from "./TextButton";
import BuildInput from "./BuildInput";
import LargeTextInput from "./LargeTextInput";
import DropdownMenu from "./DropdownMenu";
import HabitsDropdown from "./HabitsDropdown";

const CreateJournalEntry = ({
  isVisible,
  onClose,
  habits,
  entryTitle,
  entryBody,
  linkedHabit,
  changeEntryTitle,
  changeEntryBody,
  changeLinkedHabit,
}) => {
  const [openMenu, setOpenMenu] = useState(0);

  const handleOpen = async (id) => {
    setOpenMenu(id === openMenu ? 0 : id);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 bg-background-90"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setOpenMenu(0);
          }}
          accessible={false}
        >
          <SafeAreaView className="flex-1 bg-background-90">
            <View className="flex-row">
              <View className="flex-1"></View>
              <View className="flex-1">
                <Text className="text-highlight-90 text-xl">
                  {new Date().toDateString()}
                </Text>
              </View>
              <View className="flex-1">
                <TextButton text="done" onPress={onClose} />
              </View>
            </View>

            <View className="flex-1 gap-3 pb-4">
              <BuildInput
                value={entryTitle}
                handleChange={changeEntryTitle}
                inputStyles={"border-0 font-semibold text-lg p-6 border-b-2"}
                placeholder={"Title"}
              />
              <View className="flex-row justify-start">
                <HabitsDropdown
                  options={habits}
                  value={linkedHabit}
                  handleChange={changeLinkedHabit}
                  handleOpen={handleOpen}
                  isOpen={openMenu == 1}
                  id={1}
                />
              </View>
              <LargeTextInput
                value={entryBody}
                handleChange={changeEntryBody}
                placeholder={"Start writing..."}
              />
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateJournalEntry;
