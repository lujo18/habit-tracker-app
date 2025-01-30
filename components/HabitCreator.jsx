import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { memo, useCallback, useState } from 'react'
import TextButton from './TextButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import BuildInput from './BuildInput'
import DropdownMenu from './DropdownMenu'
import icons from '../constants/icons'
import { FlatList } from 'react-native-web'
import tailwindConfig from '../tailwind.config'
import ColorSwatch from './ColorSwatch'
import { useSQLiteContext } from 'expo-sqlite'

const habitColors = tailwindConfig.theme.extend.colors['habitColors']


const HabitCreator = ({ isVisible, onClose }) => {
    const [habitName, setHabitName] = useState("")
    const [habitSetting, setHabitSetting] = useState("build")
    const [selectedColor, setSelectedColor] = useState(habitColors[Object.keys(habitColors)[0]])

    const [habitGoal, setHabitGoal] = useState("")

    const [habitLimit, setHabitLimit] = useState("")
    const [habitLabel, setHabitLabel] = useState("")
    const [habitRepeat, setHabitRepeat] = useState("")

    const [openMenu, setOpenMenu] = useState(0)
    
    const db = useSQLiteContext()

    const RenderhabitSettingPage = () => {
        console.log('reload')
        switch (habitSetting) {
            case 'build':
                return <BuildScreen />
            case 'quit':
                return <QuitScreen />
            case 'tally':
                return <TallyScreen />
            default:
                return <Text>Select an option</Text>
        }
    }

    const createHabit = async () => {
        console.log("create habit")
        console.log("TEST",
            habitName,
            habitSetting,
            habitRepeat,
            habitLabel,
            habitLimit,
            0,
            habitGoal,
            selectedColor
        )

        if (!habitName) {
            Alert.alert("Error", "Name is required!")
            return
        }

        try {
            const results = await db.runAsync(
                `INSERT INTO habits (name, setting, repeat, label, limitType, current, goal, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    habitName,
                    habitSetting,
                    habitRepeat,
                    habitLabel,
                    habitLimit,
                    0,
                    habitGoal,
                    selectedColor
                ]
            )
            console.log("results", results)
            console.log("Success", "Habit inserted successfully!")
        } catch (error) {
            console.log("Insert error", error)
        }

        onClose()
        
        setHabitName('')
        setHabitSetting('build')
        setHabitGoal('')
        setHabitLimit('')
        setHabitLabel('')
        setHabitRepeat('')
    }


    const handlePress = (newState) => {
        setHabitSetting(newState)
    }

    const changeHabitName = (value) => {
        setHabitName(value)
    }

    const setColor = (color) => {
        setSelectedColor(color)
    }

    const changeHabitGoal = (value) => {
        setHabitGoal(value)
    }

    const setType = (value) => {
        setHabitLimit(value)
        setOpenMenu(0)
    }

    const setLabel = (value) => {
        setHabitLabel(value)
        setOpenMenu(0)
    }

    const setRepeat = (value) => {
        setHabitRepeat(value)
        setOpenMenu(0)
    }
    
    const handleOpen = (id) => {
        setOpenMenu(id === openMenu ? 0 : id)
    }



    const BuildScreen = () => {
       
        return(
            <View className="p-5 gap-4">
                <View>
                    <Text className="text-highlight-80">Establish a goal of building your habit with the following rules:</Text>
                    
                </View>
                <View className="flex-row items-center gap-4">
                    <Text className="text-xl text-highlight-60">do</Text>
                    <DropdownMenu value={habitLimit} onChange={setType} options={goalOption} handleOpen={handleOpen} isOpen={openMenu === 1} id={1}/>
                </View>
                <View className="flex-row items-center gap-4">
                    <BuildInput value={habitGoal} handleChange={changeHabitGoal} placeholder="#" keyboardType="numeric" inputStyles={"w-[100px] rounded-2xl text-3xl text-center"}/>
                    <DropdownMenu value={habitLabel} onChange={setLabel} options={labelOption} handleOpen={handleOpen} isOpen={openMenu === 2} id={2}/>
                </View>
                <View className="flex-row items-center gap-4">
                    <Text className="text-xl text-highlight-60">every</Text>
                    <DropdownMenu value={habitRepeat} onChange={setRepeat} options={repeatOption} handleOpen={handleOpen} isOpen={openMenu === 3} id={3}/>
                </View>
                
            </View>
        )
    }
    
    const QuitScreen = () => {
        return(
            <View className="p-5 gap-4">
                <View>
                    <Text className="text-highlight-80">Track how long it has been since you stopped a bad habit:</Text>
                </View>
                <View className="flex-row items-center gap-4">
                    <Text className="text-xl text-highlight-60">Start time:</Text>
                    
                </View>
    
            </View>
        )
    }
    
    const TallyScreen = () => {
        return(
            <View className="p-5 gap-4">
                <View>
                    <Text className="text-highlight-80">Count how much you do without a specific goal:</Text>
                </View>
                <View className="flex-row items-center gap-4">
                    <Text className="text-xl text-highlight-60">count</Text>
                    <DropdownMenu options={labelOption} handleOpen={handleOpen} isOpen={openMenu === 2} id={2}/>
                </View>
                <View className="flex-row items-center gap-4">
                    <Text className="text-xl text-highlight-60">every</Text>
                    <DropdownMenu options={repeatOption} handleOpen={handleOpen} isOpen={openMenu === 3} id={3}/>
                </View>
    
            </View>
        )
    }


    const ColorPicker = () => {
        return (
            <View className="w-full flex-row gap-2 justify-center">
                {Object.keys(habitColors).map((color) => (
                    <ColorSwatch key={color} color={habitColors[color]} setColor={setColor} isSelected={selectedColor === habitColors[color]} />
                ))}
            </View>
        )
    }

    return (
        <Modal animationType='slide' transparent={true} visible={isVisible}>
            <View className='w-full h-[90vh] justify-center p-7 bg-background-90 absolute bottom-0 rounded-t-3xl'>
                <View className="justify-center items-center">
                    <Text className="text-highlight text-2xl">Create Habit</Text>
                </View>
                
                <ScrollView >
                    <View className="flex-1 h-[100vh] justify-start">
                        <View className="my-6">
                            <BuildInput value={habitName} handleChange={changeHabitName} placeholder="Your new habit"/>
                        </View>
                        <View className="gap-2 flex-1">
                            <Text className="text-md text-highlight-60 mb-2 border-b border-background-80">Habit Type</Text>  
                            <View className="flex-row gap-4">
                                <TextButton text="Build"  containerStyles={`${habitSetting === 'build' ? "bg-habitColors-hBlue" : "bg-background-90 border-2 border-habitColors-hBlue"} flex-1`} onPress={() => handlePress('build')}/>
                                <TextButton text="Quit" containerStyles={`${habitSetting === 'quit' ? "bg-habitColors-hRed" : "bg-background-90 border-2 border-habitColors-hRed"} flex-1`} onPress={() => handlePress('quit')}/>
                                <TextButton text="Tally" containerStyles={`${habitSetting === 'tally' ? "bg-background-70" : "bg-background-90 border-2 border-background-70"} flex-1`} onPress={() => handlePress('tally')}/>
                            </View>
                
                        
                            <RenderhabitSettingPage />
                        </View>
                        <Text className="text-md text-highlight-60 mb-2 border-b border-background-80">Habit Style</Text>
                        <View className="flex-1">
                            <ColorPicker />
                        </View>
                    </View>
                </ScrollView>
                
                <View className="flex-row gap-4 mb-3">
                    <TextButton text="Cancel" onPress={onClose} containerStyles="flex-1 bg-background-80"/>
                    <TextButton text="Create" onPress={createHabit} containerStyles={`flex-1`} specialStyles={{backgroundColor: selectedColor}}/>
                </View>
            </View>
        </Modal>
    )
}

const goalOption = [
    {
        name: "at least",
        desc: "Try to reach this amount",
        icon: icons.habitAtLeast
    },
    {
        name: "at most",
        desc: "Avoid going over set amount",
        icon: icons.habitAtMost
    }
]

const repeatOption = [
    {
        name: "day",
        desc: "Resets everyday",
        icon: icons.habitDaily
    },
    {
        name: "week",
        desc: "Resets every week",
        icon: icons.habitWeekly
    },
    {
        name: "month",
        desc: "Resets every month",
        icon: icons.habitMonthly
    },
    {
        name: "year",
        desc: "Resets every year",
        icon: icons.habitYearly
    },
]

const labelOption = [
    {
        name: "minutes"
    },
    {
        name: "hours"
    },
    {
        name: "pages"
    }
]




export default HabitCreator