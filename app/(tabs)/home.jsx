import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { memo, useCallback, useContext, useEffect, useState, createContext } from 'react'
import icons from '../../constants/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import Habit from '../../components/Habit'
import tailwindConfig from '../../tailwind.config'
import HabitCreator from '../../components/HabitCreator'
import { DevRepository, HabitHistoryRepository, HabitsRepository } from '../../db/sqliteManager'
import DateSelector from '../../components/DateSelector' 
import { useLoading } from '../../components/LoadingProvider'
//import { Image } from 'expo-image'
import { DateContext, useDateContext } from '../../contexts/DateContext'
import QuitHabit from '../../components/QuitHabit'
import TimerResetModal from '../../components/TimerResetModal'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, Easing, measure } from 'react-native-reanimated'
import { Link } from 'expo-router'
import { ScrollView } from 'react-native'

const tailwindColors = tailwindConfig.theme.extend.colors

const habitGroups = [
  {
    label: "Daily",
    type: "day",
    icon: icons.habitDaily,
    visible: true
  },
  {
    label: "Weekly",
    type: "week",
    icon: icons.habitWeekly,
    visible: true
  },
  {
    label: "Monthly",
    type: "month",
    icon: icons.habitMonthly,
    visible: true
  },
  {
    label: "Yearly",
    type: "year",
    icon: icons.habitYearly,
    visible: true
  },
  {
    label: "Quit",
    type: "forever",
    icon: icons.habitYearly,
    visible: true
  }
]

const Home = () => {
  const habitsRepo = new HabitsRepository();
  const historyRepo = new HabitHistoryRepository(); // DELETE THIS
  const devRepo = new DevRepository() //DELETE THIS

  const [history, setHistory] = useState()
  
  useEffect(() => {
    const fetchHistory = async () => {
      const result = await historyRepo.getAllHistory(1);
      setHistory(result);
    };
    fetchHistory();
  }, [selectedDate]);
  
  const yearToMs = 365 * 24 * 60 * 60 * 1000;
  const oneYearAgo = new Date("2024-12-01"/*Date.now() - yearToMs*/);
  const oneYearAhead = new Date();
  oneYearAhead.setHours(0, 0, 0, 0);
  

  const {showLoading, hideLoading, isLoading } = useLoading();
  const {selectedDate, seteSelectedDate} = useDateContext();

  const [habitGroupsInfo, setHabitGroupsInfo] = useState(habitGroups)
  
  const [showCreateHabit, setShowCreateHabit] = useState(false)
  const [habits, setHabits] = useState([])
  const [quitHabits, setQuitHabits] = useState([])

  //const [date, setDate] = useState(null)

  // Timer Reset Modal for time based habits
  const [resetTimerModal, setResetTimerModal] = useState({})

  /*const setCurrentDate = async (value) => {
    setDate(value)
  }*/

  const onModalClose = async () => {
    setShowCreateHabit(false)
    queryHabits(selectedDate)
  }

  const onAddHabit = () => {
    setShowCreateHabit(true)
  }

  const onTimerResetClose = () => {
    setResetTimerModal({})
  }

  const onTimerResetOpen = (data) => {
    setResetTimerModal(data)
  }

  const queryHabits = async (date) => {
    showLoading()

    try {
      //setHabits(await habitsRepo.initializeHabits(date))
      setHabits(await habitsRepo.getAll())
      console.log(habits)
    }
    finally {
      hideLoading()
    }
  }

  useEffect(() => {
    const initialize = async() => {
      /*const initDate = async() => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1)
        currentDate.setHours(0, 0, 0, 0);
        setDate(currentDate);
      }

      await initDate()*/
      await queryHabits(selectedDate)

      /*if (!date) {
        console.log("INIT DATE")
        await initDate()
      }
      else {
        console.log("INITIALIZE")
        await queryHabits(date);
      }*/
    }

    initialize()
  }, []);


  const HabitGroup = ({ group }) => {
    
    const isOpen = useSharedValue(true); // Flag to indicate measurement completion
    const [contentHeight, setContentHeight] = useState(null) // Shared value for animated height
  
    // Animated style for the Animated.View
    const animatedStyle = useAnimatedStyle(() => {
      return {
      height: withTiming(isOpen.value ? contentHeight : 0, {
        easing: Easing.out(Easing.exp),
        duration: 600,
      }),
      opacity: withTiming(isOpen.value ? 1 : 0, { duration: 500 }),
      overflow: "hidden"
    }});
  
    const closeHabitGroup = (groupType, visibility) => {
      if (isOpen.value != visibility) {
        isOpen.value = visibility
      }
    };
  
    const filteredHabits = habits.filter((habit) => habit.repeat === group.type);
  
    const RepeatHeaders = useCallback(({ group }) => {

      const toggleGroup = () => {
        setIsAnimating(true)
        closeHabitGroup(group.type, !isOpen.value);
        setTimeout(() => {setIsAnimating(false)}, 600)
      }

      const [isAnimating, setIsAnimating] = useState(false)
      return (
        <TouchableOpacity
          onPress={toggleGroup}
          disabled={isAnimating}
        >
          <View className="flex-row items-center gap-2 my-2">
            <Image
              source={icons.dropdown}
              className={`w-8 h-8 ${true ? "rotate-180" : "rotate-0"}`}
              contentFit="contain"
            />
            <Image source={group.icon} className="w-8 h-8" contentFit="contain" />
            <Text className="text-highlight-70 text-lg font-lora-semibold-italic">{group.label} Habits</Text>
          </View>
        </TouchableOpacity>
      );
    }, []);
  
    if (filteredHabits.length > 0) {
      return (
        <View>
          <RepeatHeaders group={group} />
          <Animated.View style={[animatedStyle, {position: 'relative'}]}>
            <View
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                if (height != 0 && !contentHeight) setContentHeight(height)
              }}
              style={{position: 'absolute', right:0, left:0}}
            >
              <FlatList
                data={filteredHabits}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  return item.repeat === "forever" ? (
                    <QuitHabit
                      key={item.id.toString()}
                      data={item}
                      handleReset={onTimerResetOpen}
                    />
                  ) : (
                    
                    <Habit key={item.id.toString()} data={item} />
                   
                    
                  );
                }}
              />
            </View>
          </Animated.View>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <>
    {/*<DateContext.Provider value={date}>*/}
    
      <SafeAreaView className="bg-background h-full w-full flex-1" edges={["top"]} >
        <View className="flex-row align-center  p-4">
          <View>
            <Text>Other Option</Text>
          </View>
          <View className="flex-1">
            <Text>Today's Progress</Text>
          </View>
          <TouchableOpacity className={`bg-background-80 p-4 rounded-full ${showCreateHabit ? "opacity-0" : ""}`} onPress={() => onAddHabit()}>
            <Image 
              source={icons.addBox}
              className="w-9 h-9"
              contentFit='cover'
              tintColor={tailwindColors["highlight"]["90"]}
              
            />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-red-50" onPress={() => {devRepo.DropTables()}}><Text>Drop Table</Text></TouchableOpacity>
          
          <HabitCreator isVisible={showCreateHabit} onClose={onModalClose} />
        </View>

        <View>
          
          <DateSelector start={oneYearAgo} end={oneYearAhead} />
        </View>


        
        <FlatList
          data={habitGroupsInfo}
          keyExtractor={(item) => item.type}
          renderItem={({item: group}) => <HabitGroup group={group}/>}
          className='px-4'
        />

        <TimerResetModal 
            data={resetTimerModal}
            onClose={onTimerResetClose}
            showLoading={showLoading}
            hideLoading={hideLoading}
        />
      </SafeAreaView>
      
    
    {/*</DateContext.Provider>*/}
    </>
  )
}

export default Home