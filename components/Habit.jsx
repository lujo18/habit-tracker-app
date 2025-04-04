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



const Habit = memo(({data}) => {
    const historyRepo = new HabitHistoryRepository();

    const [amount, setAmount] = useState(0);
    const curAmount = useRef(null); 

    const [isCompleted, setIsCompleted] = useState(0)
    const [currentStreak, setCurrentStreak] = useState(0)

    const {id, name, completion, setting, repeat, type, label, color, goal, location, date, streak, completed} = data

    const selectedDate = useContext(DateContext)
    const { isLoading } = useLoading();

    const borderColor = color
    const backgroundColor = tailwindConfig.theme.extend.colors["background"]["90"]
    const tailwindColors = tailwindConfig.theme.extend.colors

    useEffect(() => {
        const fetchCompletion = async () => {
            try {
                setAmount(await historyRepo.getCompletion(id, selectedDate))
                curAmount.current = amount;
            } 
            catch (error) {
                console.log("Failed to fetch completion:", error);
            }
        }

        if (!isLoading) {
            fetchCompletion()
            setCurrentStreak(streak)
            setIsCompleted(completed)
        }
        
    }, [isLoading])

    async function updateHabitCompletion() {
        curAmount.current = amount
        await historyRepo.setCompletion(id, amount, selectedDate, goal, repeat)
        progressValue.set(amount)
    }

    useEffect(() => {
        if (!isLoading) {
            if (!isCompleted && amount >= goal) {
                setIsCompleted(true)
                setCurrentStreak(currentStreak + 1)
            }
            updateHabitCompletion()
        }   
    }, [amount])

    const addMetric = () => {
        if (curAmount.current < goal) {
            setAmount((prev) => prev + 1)
        }
    }

    const HabitButton = () => {
        return (
            <TouchableOpacity onPress={addMetric} className={`w-16 h-16 overflow-hidden rounded-2xl justify-center items-center ${amount < goal ? "bg-background-80" : "bg-highlight-60"}`} disabled={amount===goal}>
                {
                    isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Image
                            source={amount < goal ? icons.addBox : icons.check}
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
            data={data}
            habitCompletionDisplay={HabitCompletionDisplay}
            habitButton={HabitButton}
            enableStreak={true}
            currentStreak={currentStreak}
            amount={amount}
            isCompleted={isCompleted}
        />
    )
}) 

export default Habit