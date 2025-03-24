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



const Habit = memo(({data}) => {
    const historyRepo = new HabitHistoryRepository();

    const [amount, setAmount] = useState(0);
    const timer = useRef(null); // FIX ME
    const curAmount = useRef(null); 

    const [isCompleted, setIsCompleted] = useState(0)
    const [currentStreak, setCurrentStreak] = useState(0)

    const {id, name, completion, setting, repeat, type, label, color, goal, location, date, streak, completed} = data

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

    // Tailwind colors
    const progressValue = useSharedValue(amount)
    const borderColor = color
    const backgroundColor = tailwindConfig.theme.extend.colors["background"]["90"]
    const tailwindColors = tailwindConfig.theme.extend.colors

    const selectedDate = useContext(DateContext)
    const { isLoading } = useLoading();

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
        else {
            if (timer.current) clearInterval(timer.current)
        }
    }

    // TODO FIX THIS FUNCTIONALITY
    const longPressAdd = () => {
        if (timer.current) clearInterval(timer.current)

        timer.current = setInterval(() => {
            addMetric()
        }, 200)
    }

    const stopTimer = () => {
        clearInterval(timer.current)
    }

    const RenderButton = () => {
        switch(setting) {
            case 'build':
                return <AddButton />
            case 'quit':
                return <ResetButton />
            case 'tally':
                return <AddButton />
            default:
                return <AddButton />
        }
    }

    const AddButton = memo(() => {
        return (
            <TouchableOpacity onPressOut={() => {stopTimer()}} delayLongPress={500} onLongPress={() => {longPressAdd()}} onPress={addMetric} className={`w-16 h-16 overflow-hidden rounded-2xl justify-center items-center ${amount < goal ? "bg-background-80" : "bg-highlight-60"}`} disabled={amount===goal}>
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
    })


    return (
        <>
        
            <View 
                className="rounded-2xl overflow-hidden justify-center relative items-center p-1 my-4" 
                onLayout={({ nativeEvent: { layout }}) => {
                    setCanvasSize(layout)
                }}
            >
                <View className={`${amount < goal ? "bg-background-90" : `bg-[${color}]`} flex-row w-full p-5 gap-3 rounded-2xl z-10`}>
                    <View className="flex-1 gap-2">
                        <View className="flex-row items-center gap-4">
                            <Text className="text-highlight text-2xl">
                                {name}
                            </Text>
                            <View className="flex-row items-center justify-start">
                                
                                <Text className={`text-xl ${isCompleted ? "text-highlight" : "text-background-70"} `}>
                                    {currentStreak}
                                </Text>
                                
                                
                                <Image 
                                    source={icons.streakFire}
                                    resizeMode='contain'
                                    className="h-6 w-6"
                                    tintColor={isCompleted ? tailwindColors['highlight']['80'] : tailwindColors['background']['70']}
                                />
                            </View>
                        </View>
                        <Text className="text-highlight-80">
                            {amount} / {goal} {label}
                        </Text>
                    </View>
                    <View>
                        <View className="p-2">
                            <Text className="text-highlight-60">
                                {
                                    formatRepeatText(repeat)
                                }
                            </Text>
                        </View>
                    </View>
                    
                    <RenderButton />
                    
                </View>
                <Canvas style={{ flex: 1, position: 'absolute', top:0, left:0, width:canvasSize.width, height:canvasSize.height}}>
                    <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height}>
                        <SweepGradient
                            origin={vec(canvasSize.width / 2, canvasSize.height / 2)}
                            c={vec(canvasSize.width / 2, canvasSize.height / 2)}
                            colors={[borderColor, borderColor, backgroundColor, backgroundColor]}
                            positions={[
                                0,
                                amount/goal,
                                amount/(goal - goal/7),
                                1
                            ]}
                            transform={[{rotate: -Math.PI / 2}]}
                            
                        />
                    </Rect>
                </Canvas>
                
            </View>
            
        </>
    )
}) 

export default Habit