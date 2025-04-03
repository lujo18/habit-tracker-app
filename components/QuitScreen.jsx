import { View, Text} from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'

const QuitScreen = memo(({startTime, setStartTime}) => {
    useEffect(() => {
        setStartTime(new Date());
      
    }, [])

    return(
        <View className="p-5 gap-4">
            <View>
                <Text className="text-highlight-80">Track how long it has been since you stopped a bad habit:</Text>
            </View>
            <View className="gap-2">
                <Text className="text-xl text-highlight-60">Start time:</Text>
                <DatePicker 
                    mode="datetime" 
                    date={startTime} 
                    onDateChange={setStartTime} 
                    theme={"dark"} 
                    maximumDate={new Date(new Date().setHours(23, 59, 59, 999))}
                />
            </View>
        </View>
    )
}) 

export default QuitScreen