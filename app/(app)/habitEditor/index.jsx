import { View, Text, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { useMemo, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Subheader from '../../../components/Text/Subheader';
import BuildInput from '../../../components/BuildInput';
import DropdownMenu from '../../../components/DropdownMenu';
import { HabitSettingRepository, HabitsRepository } from '../../../db/sqliteManager';
import PopupModalBase from '../../../components/PopupModalBase';
import Header from '../../../components/Text/Header';
import XLHeader from '../../../components/Text/XLHeader';
import FancyContainer from '../../../components/containers/FancyContainer';
import TextButton from '../../../components/TextButton';
import { useHabitUpdate } from '../../../contexts/HabitUpdateContext'

const habitSettingRepo = new HabitSettingRepository()

const habitEditor = () => {

  const HabitsRepo = useMemo(() => new HabitsRepository(),[]) 
  const {triggerUpdate} = useHabitUpdate()

  const params = useLocalSearchParams() // Gets basic data about habit


  const standardHabitData = JSON.parse(params.data)
  const adaptiveSuggestion = params.adaptiveSuggestion ? JSON.parse(params?.adaptiveSuggestion) : null

  const adaptiveNewGoal = adaptiveSuggestion.newGoal || null 

  const [editedHabitData, setEditedHabitData] = useState(standardHabitData)
  
  const changeEditedHabitData = (key, value) => {
    setEditedHabitData((prev) => ({ ...prev, [key]: value }));
  }

  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(0);

  const [labelOption, setLabelOption] = useState([])
  const [locationOption, setLocationOption] = useState([])

  const [adaptiveModalVisible, setAdaptiveModalVisible] = useState(adaptiveSuggestion ? true : false)

  

  const retrieveOptions = async () => {
    setLabelOption(await habitSettingRepo.getHabitLabels());
    setLocationOption(await habitSettingRepo.getHabitLocations());
  }

  useEffect(() => {
    retrieveOptions()
  }, [])


  const handleOpen = (id) => {
    setOpenMenu(id === openMenu ? 0 : id);
  };


  const addHabitLabel = async (value) => {
    await habitSettingRepo.addHabitLabel(value)
    retrieveOptions()
  }

  const addHabitLocation = async (value) => {
    await habitSettingRepo.addHabitLocation(value)
    retrieveOptions()
  }


  const updateValues = async () => {
    console.log("TEST", editedHabitData.id, ["name", "referenceGoal", "label"], [editedHabitData.name, editedHabitData.referenceGoal, editedHabitData.label])
    try {
      await HabitsRepo.setValues(
        editedHabitData.id,
        ["name", "referenceGoal", "label"],
        [editedHabitData.name, editedHabitData.referenceGoal, editedHabitData.label]
      );

      if (editedHabitData.referenceGoal != standardHabitData.referenceGoal) {
        await HabitsRepo.updateAdjustmentDate(standardHabitData.id, new Date())
      }

      triggerUpdate()
    } catch (error) {
      console.error("Failed to update habit", error);
    }
  }
  
  return (
    <SafeAreaView className="w-full h-full bg-background-90" edges={["top"]}>
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); /*setOpenMenu(0);*/}} accessible={false}>
      <View className='w-full h-full'>
        <View className="p-4 flex-row">
          <TouchableOpacity className="flex-1" onPress={() => router.back()}>
            <Text className="text-white">BACK</Text>
          </TouchableOpacity>
          <Text className="flex-2 text-2xl text-white">{standardHabitData.name}</Text>
          <View className="flex-1"></View>
        </View>
        <SafeAreaView className="flex-1 flex justify-between bg-background p-4 gap-4" edges={["bottom"]}>
          <View className='gap-4'>
              <Subheader>{JSON.stringify(editedHabitData)}</Subheader>
              <BuildInput
                value={editedHabitData.name}
                handleChange={(val) => changeEditedHabitData("name", val)}
                placeholder="Habit name"
                inputStyles="text-lg"
              />
              <View className='flex flex-row gap-4'>
                <BuildInput
                  value={editedHabitData.referenceGoal.toString()}
                  handleChange={(val) => changeEditedHabitData("referenceGoal", parseInt(val) || "")}
                  placeholder="#"
                  keyboardType="numeric"
                  inputStyles={"w-[100px] rounded-2xl text-2xl text-center"}
                />
                <DropdownMenu
                  value={editedHabitData.label}
                  onChange={(val) => changeEditedHabitData("label", val)}
                  options={labelOption}
                  handleOpen={handleOpen}
                  isOpen={openMenu === 2}
                  id={2}
                  isCustom={true}
                  handleCreateNew={addHabitLabel}
                />
            
              </View>

              <View className='flex flex-row'>
                <DropdownMenu
                  value={editedHabitData.location}
                  onChange={(val) => changeEditedHabitData("location", val)}
                  options={locationOption}
                  handleOpen={handleOpen}
                  isOpen={openMenu === 3}
                  id={3}
                  isCustom={true}
                  handleCreateNew={addHabitLocation}
                />
              </View>
            
              {adaptiveModalVisible &&
            
                  <FancyContainer>
                    <Subheader>Compass Suggestion</Subheader>
                    <Text className='text-background-70 font-generalsans-medium text-sm'>Our algorithm has found the best goal</Text>
                    <View className='flex flex-row gap-2 items-end my-6 mb-8'>
            
            
                      <XLHeader>{adaptiveNewGoal}</XLHeader>
                      <Subheader>{standardHabitData.label}</Subheader>
                    </View>
                    <View className="flex-row gap-4">
                      <TextButton
                        text="Cancel"
                        type="outline"
                        onPress={() => setAdaptiveModalVisible(false)}
                      />
                      <TextButton
                        text={"Use Suggestion"}
                        type={"solid"}
                        onPress={() => {changeEditedHabitData("referenceGoal", parseInt(adaptiveNewGoal) || ""); setAdaptiveModalVisible(false)}}
                      />
                    </View>
                  </FancyContainer>
              }
          </View>

          <View className="flex-row gap-4">
            <TextButton
              text="Cancel"
              type="outline"
              onPress={() => router.back()}
            />
            <TextButton
              text={"Confirm Change"}
              type={"solid"}
              onPress={() => {updateValues(); router.back()}}
            />
          </View>
        </SafeAreaView>
      </View>
      
      </TouchableWithoutFeedback>
      <PopupModalBase isVisible={false}>
      </PopupModalBase>
    </SafeAreaView>
  )
}

export default habitEditor