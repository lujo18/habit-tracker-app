import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import icons from '../constants/icons'

import { Canvas, Rect, SweepGradient, vec} from '@shopify/react-native-skia'
import Animated, { interpolate, useSharedValue, withReanimatedTimer, withRepeat, withTiming, Easing, withSpring } from 'react-native-reanimated'
import tailwindConfig from '../tailwind.config'
import { HabitHistoryRepository } from '../db/sqliteManager'
import { DateContext } from '../contexts/DateContext'
import { useLoading } from './LoadingProvider'
import { formatRepeatText } from '../utils/formatters'
import HabitBase from './HabitBase'



const Habit = memo(({data, canSubtract, updateSelectedAmount}) => {
    const historyRepo = new HabitHistoryRepository();

    const [amount, setAmount] = useState(0);
    const [goal, setGoal] = useState(0);
    const curAmount = useRef(null); 

    const [isCompleted, setIsCompleted] = useState(0)
    const [currentStreak, setCurrentStreak] = useState(0)

    const [dynamicData, setDynamicData] = useState(null)

    const {id, name, completion, setting, repeat, type, label, color, referenceGoal, location, date, streak, completed} = data

    const selectedDate = useContext(DateContext)
    const { isLoading } = useLoading();

    const borderColor = color
    const backgroundColor = tailwindConfig.theme.extend.colors["background"]["90"]
    const tailwindColors = tailwindConfig.theme.extend.colors

    useEffect(() => {
        const fetchHabitData = async () => {
            const data = await historyRepo.getEntry(id, selectedDate)
            setDynamicData(data)
            console.log("Dynamic Data: ", data)
            
            if (data == null) {
                console.log("No history, waiting for action")
                setAmount(0);
                setGoal(referenceGoal);
                currentStreak(0)
                setIsCompleted(false)
            }
            else {
                setAmount(data.completionCount)
                setGoal(data.goal)
                currentStreak(data.streak)
                setIsCompleted(completed)
            }
            //setAmount(await historyRepo.getCompletion(id, selectedDate)) // try to get completion
            curAmount.current = amount;
            
        }

        if (!isLoading) {
            fetchHabitData()
            updateSelectedAmount && updateSelectedAmount(curAmount.current)
            //setCurrentStreak(streak)
            //setIsCompleted(completed)
        }
        
    }, [isLoading, selectedDate])

    async function updateHabitCompletion(amount) {
        updateSelectedAmount && updateSelectedAmount(amount)
        curAmount.current = amount
        //console.log("UPDATE: ", id, amount, selectedDate, goal, repeat)
        await historyRepo.setCompletion(id, amount, selectedDate, goal, repeat)
        progressValue.set(amount)
    }

    useEffect(() => {
        const inner = async () => {
            
            if (dynamicData == null && amount > 0) {
                console.log("Action heard, creating entry")
                setDynamicData(await historyRepo.getEntryWithCheck(id, selectedDate))
            }
           
            if (dynamicData && !isLoading) {
                if (!isCompleted && amount >= goal) {
                    setIsCompleted(true)
                    setCurrentStreak(currentStreak + 1)
                }
                else if (isCompleted && amount < goal) {
                    setIsCompleted(false)
                    setCurrentStreak(currentStreak - 1)
                }
            }  
        }
        inner() 
    }, [amount])

    const addMetric = (value) => {
        const newAmount = amount + value <= 0 ? 0 : amount + value
        setAmount(newAmount)
        updateHabitCompletion(newAmount)
    }

    const HabitButton = ({incrementor}) => {
        return (
            <TouchableOpacity onPress={() => {addMetric(incrementor)}} className={`w-16 h-16 overflow-hidden rounded-2xl justify-center items-center ${amount < goal ? "bg-background-80" : "bg-highlight-60"}`}>
                {
                    isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Image
                            source={incrementor > 0 ? (amount < goal ? icons.addBox : icons.check) : icons.subtractLine}
                            resizeMode='cover'
                            className="w-[3rem] h-[3rem]"
                            tintColor={amount < goal ? tailwindColors['highlight']['80'] : tailwindColors['background']['90']}
                        />
                    )
                }
            </TouchableOpacity>  
        )
    }



    const HabitCompletionDisplay = () => {
        return (
            <Text className="text-highlight-80">
                {amount} / {goal} {label}
            </Text>
        )
    }

    return (
        <HabitBase
            data={{...dynamicData, ...data }}
            habitCompletionDisplay={HabitCompletionDisplay}
            habitButton={() => <HabitButton incrementor={1} />}
            habitSubtractButton={canSubtract ? () => <HabitButton incrementor={-1} /> : null}
            enableStreak={true}
            currentStreak={currentStreak}
            amount={amount}
            goal={goal}
            isCompleted={isCompleted}
        />
    )
}) 

export default Habit