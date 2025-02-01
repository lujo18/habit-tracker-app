import { View, Text } from 'react-native'
import React, { memo } from 'react'

const QuitScreen = memo(() => {
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
}) 

export default QuitScreen