import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import icons from '../constants/icons'

import { Canvas, Rect, SweepGradient, TwoPointConicalGradient, Skia, Shader, vec, rotate } from '@shopify/react-native-skia'
import Animated, { interpolate, useSharedValue, withReanimatedTimer, withRepeat, withTiming, Easing, withSpring } from 'react-native-reanimated'
import tailwindConfig from '../tailwind.config'
import { HabitHistoryRepository } from '../db/sqliteManager'
import { DateContext } from '../app/(tabs)/home'
import { useLoading } from './LoadingProvider'



const Habit = memo(({data}) => {
    const historyRepo = new HabitHistoryRepository();

    const [amount, setAmount] = useState(0);
    const timer = useRef(null); // FIX ME
    const curAmount = useRef(null); 

    const {id, name, completion, setting, repeat, type, label, color, goal, location, date} = data

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
        }
        
    }, [isLoading])

    async function updateHabitCompletion() {
        curAmount.current = amount
        await historyRepo.setCompletion(id, curAmount.current, selectedDate)
        progressValue.set(amount)
    }

    useEffect(() => {
        updateHabitCompletion()
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
                    <View className="flex-1">
                        <Text className="text-highlight text-2xl">
                            {name}
                        </Text>
                        <Text className="text-highlight-80">
                            {amount} / {goal} {label}
                        </Text>
                    </View>
                    <View>
                        <View className={` p-2 rounded-2xl`}>
                            <Text className="text-highlight-60">
                                {
                                    (() => {
                                        switch(repeat) {
                                            case 'day':
                                                return "Daily"
                                            case 'week':
                                                return "Weekly"
                                            case 'month':
                                                return "Monthly"
                                            case 'year':
                                                return "Yearly"
                                            default: 
                                                return "None"
                                        }
                                    })()
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