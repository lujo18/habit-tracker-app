import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
  Keyboard,
  SafeAreaView
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextButton from "./TextButton";
import BuildInput from "./BuildInput";
import LargeTextInput from "./LargeTextInput";
import HabitsDropdown from "./HabitsDropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Markdown from "react-native-markdown-display";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
//import { MarkdownTextInput } from "@expensify/react-native-live-markdown";


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
  const [isScrolling, setIsScrolling] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const journalEditor = useRef();

  // Set up keyboard listeners to get height
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardOpen(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    setOpenMenu(0);
  }, [isVisible]);

  const handleOpen = async (id) => {
    setOpenMenu(id === openMenu ? 0 : id);
  };

  const handleEmptyAreaPress = () => {
    Keyboard.dismiss();
    setOpenMenu(0);
  };

  // Calculate bottom padding for toolbar
  const toolbarBottomPadding = keyboardOpen
    ? 0 // When keyboard is open, no extra padding needed
    : insets.bottom; // When keyboard is closed, respect safe area

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View className="h-[90vh] w-full bg-background-90 absolute bottom-0 rounded-t-3xl">
        <SafeAreaView className="flex-1 bg-background-80">
          <View className="flex-1 bg-background-90">
            {/* Header */}
            <View className="flex-row gap-3 items-center p-4">
              <View className="flex-1"></View>
              <View className="flex-2">
                <Text className="text-highlight-90 text-lg font-bold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View className="flex-1">
                <TextButton text="done" onPress={onClose} containerStyles="p-0"/>
              </View>
            </View>

            {/* Content - with padding at bottom for toolbar */}
            <View
              className={`flex-1 ${keyboardOpen ? "pb-8" : "pb-16"}`}
            
            >
              <KeyboardAwareScrollView
                className="px-4 flex-1"
                enableOnAndroid
                scrollToOverflowEnabled={true}
                enableAutomaticScroll={true}
                extraHeight={0}
                extraScrollHeight={0}
                keyboardOpeningTime={0}
                scrollEventThrottle={16}
                enableResetScrollToCoords={false}
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={() => setIsScrolling(true)}
                onScrollEndDrag={() => setIsScrolling(false)}
                contentContainerStyle={{flexGrow: 1}}
              >
                <View className="gap-3 flex-1">
                  <BuildInput
                    value={entryTitle}
                    handleChange={changeEntryTitle}
                    inputStyles={"px-1 py-2 font-semibold"}
                    placeholder={"Title"}
                  />
                  <View className="flex-row justify-center">
                    <HabitsDropdown
                      options={habits}
                      value={linkedHabit}
                      onChange={changeLinkedHabit}
                      handleOpen={handleOpen}
                      isOpen={openMenu == 1}
                      id={1}
                    />
                    <View className="flex-1"></View>
                  </View>

                  
                    {/*<LargeTextInput
                      value={entryBody}
                      handleChange={changeEntryBody}
                      placeholder={"Start writing..."}
                      isScrolling={isScrolling}
                    />*/}
  
                    <RichEditor
                      initialContentHTML={entryBody}
                      ref={journalEditor}
                      value={entryBody}
                      onChange={changeEntryBody}
                      style={{flex: 1}}
                      editorStyle={{
                        backgroundColor: "transparent",
                        color: "white",
                        fontSize: 16,
                        lineHeight: 24,
                        initialCSSText: 'fontFamily: "System'
                        
                      }}
                    />

                   
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>

          {/* Toolbar - positioned at bottom */}
          <View 
            className="absolute left-0 right-0 bg-background-80"
            style={{
              bottom: keyboardOpen ? keyboardHeight - (Platform.OS === 'ios' ? 0 : insets.bottom) : 0,
              paddingBottom: toolbarBottomPadding,
            }}
          >
            <RichToolbar 
              editor={journalEditor}
              actions={[ 
                actions.setBold,
                actions.setItalic, 
                actions.setUnderline,
                actions.setBullet]}
              style={{backgroundColor:"#373F4E"}}
              iconTint={"#D1D6E0"}
            />
            {/*<View className="w-full flex-row justify-around">
              <TouchableOpacity className="p-4">
                <Text className="text-highlight-90 font-bold text-xl">B</Text>
              </TouchableOpacity>
              <TouchableOpacity className="p-4">
                <Text className="text-highlight-90 italic text-xl">I</Text>
              </TouchableOpacity>
              <TouchableOpacity className="p-4">
                <Text className="text-highlight-90 underline text-xl">U</Text>
              </TouchableOpacity>
              <TouchableOpacity className="p-4">
                <Text className="text-highlight-90 text-xl">L</Text>
              </TouchableOpacity>
            </View>*/}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default CreateJournalEntry;
