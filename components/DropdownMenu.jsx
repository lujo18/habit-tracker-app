import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { memo, useState } from 'react'
import icons from '../constants/icons'
import { Portal } from 'react-native-paper'




const DropdownMenu = memo(function DropdownMenu ({value, onChange, options, handleOpen, id, isOpen}) {

    console.log(value)
    console.log(isOpen)

    const toggleDropdown = () => {
        console.log("handle open")
        handleOpen(id)
    }

    return (
        <View className="relative flex-1">
            <TouchableOpacity className="flex-row p-4 bg-background-80 items-center justify-between rounded-xl relative" onPress={toggleDropdown}>
                
                <Text className="text-highlight-90 text-xl">{value ? value : "Select an option"}</Text>
                <Image
                    source={icons.dropdown}
                    className={`h-8 w-8 ${isOpen ? "rotate-180" : "rotate-0"}`}
                />
               
            </TouchableOpacity>
            {isOpen && (
         
               
                <ScrollView className="max-h-[180px] p-2 rounded-xl bg-background-80 absolute z-10 w-full top-full ">
                    <View className=" gap-2">
                
                        {
                            options.map(item => (
                                <TouchableOpacity
                                    key={item.name}
                                    className="p-3 bg-background-70 items-center rounded-xl flex-row gap-2 top-0"
                                    onPress={(e) => {
                                        e.stopPropagation()
                                        onChange(item.name)
                                        
                                    }}
                                >
                                    {item.icon && (<View>
                                        <Image
                                            source={item.icon}
                                            className="w-8 h-8"
                                        />
                                    </View>)}
                                    <View className="gap-1">
                                        <Text className="text-highlight-90 text-xl">{item.name}</Text>
                                        {item.desc && (<Text className="text-highlight-60">{item.desc}</Text>)}
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                
                    </View>
                </ScrollView>
            
              
              
            )}
        </View>
    )
})

export default DropdownMenu