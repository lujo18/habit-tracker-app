import { View, Text, Modal, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useHabitBrief } from "../contexts/HabitBriefContext";
import { useHabitUpdate } from "../contexts/HabitUpdateContext";
import icons from "../constants/icons";
import tailwindConfig from "../tailwind.config";
import BasicContainer from "./containers/BasicContainer";
import Header from "./Text/Header";
import XLHeader from "./Text/XLHeader";
import Subheader from "./Text/Subheader";
import TextButton from "./TextButton";
import { ScrollView } from "react-native";

const tailwindColors = tailwindConfig.theme.extend.colors;

const HabitBrief = ({ habitBriefOpen, closeHabitBrief }) => {
  const { habitBriefContent } = useHabitBrief();
  const { triggerUpdate } = useHabitUpdate();

  if (!habitBriefContent) return null;

  const [dynamicHabitsChanged, setDynamicHabitsChanged] = useState(0);

  useEffect(() => {
    setDynamicHabitsChanged(
      habitBriefContent.reduce(
        (acc, item) => acc + (item.type === "dynamic" ? 1 : 0),
        0
      )
    );
  }, [habitBriefContent]);

  return (
    <Modal
      visible={
        habitBriefOpen && habitBriefContent && habitBriefContent.length > 0
      }
      animationType="fade"
      transparent={true}
    >
      <View className="w-full h-full justify-center items-center p-4 bg-black/70">
        <View className="bg-background w-full rounded-xl border-2 border-background-90 items-center justify-center">
          <Header className="text-lg font-bold mb-2">Habit Brief</Header>
          <ScrollView className="w-full">
           
            {
              dynamicHabitsChanged > 0 &&
              <View className="flex w-full p-4">
                <Subheader>Summary</Subheader>
                <View className="ml-2">
                  {dynamicHabitsChanged > 0 && (
                    <Header>
                      {dynamicHabitsChanged} changes to dynmaic habits
                    </Header>
                  )}
                </View>
              </View>
            }
            <View className="flex w-full p-4 gap-4">
              {habitBriefContent.map((entry, index) => (
                <View key={index} className="flex-row">
                  <BasicContainer>
                    <View className="mb-2 gap-2">
                      <View className="flex-row items-center gap-2">
                        {entry.type === "dynamic" && (
                          <Image
                            source={icons.shining}
                            className="w-6 h-6"
                            resizeMode="cover"
                            tintColor={tailwindColors["highlight"]["90"]}
                          />
                        )}
                        <XLHeader>{entry.name}</XLHeader>
                      </View>
                      <View>
                        <Subheader>{entry.title}</Subheader>
                        <Text className="text-background-70 font-generalsans-medium text-sm">
                          {entry.description}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-evenly">
                      <View className="items-center">
                        <Text className="text-background-70 font-generalsans-medium text-sm">
                          Old goal:
                        </Text>
                        <XLHeader>{entry.oldValue}</XLHeader>
                      </View>
                      <View className="justify-center">
                        <Image
                          source={icons.arrowRight}
                          className="w-6 h-6"
                          resizeMode="cover"
                          tintColor={
                            entry.oldValue < entry.newValue
                              ? tailwindColors["habitColors"]["green"]
                              : entry.oldValue > entry.newValue
                              ? tailwindColors["habitColors"]["red"]
                              : tailwindColors["highlight"]["90"]
                          }
                        />
                      </View>
                      <View className="items-center">
                        <Text className="text-background-70 font-generalsans-medium text-sm">
                          New goal:
                        </Text>
                        <XLHeader>{entry.newValue}</XLHeader>
                      </View>
                    </View>
                  </BasicContainer>
                </View>
              ))}
            </View>
          </ScrollView>

          <View className="flex-row gap-4 p-4">
            <TextButton
              text={"Close"}
              type={"solid"}
              onPress={() => {
                triggerUpdate();
                closeHabitBrief();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default HabitBrief;
