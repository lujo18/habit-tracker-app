import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import icons from '../constants/icons'
import DropdownMenu from './DropdownMenu'
import { formatRepeatText } from '../utils/formatters'

const HabitsDropdown = ({
  value, // Dropdown value passed in
  onChange, // Function to change dropdown value
  options, // Dropdown options
  handleOpen, // Changes the open menu state
  id, // unique menu # for determining isOpen
  isOpen,
  isCustom,
  handleCreateNew
}) => {

  const RenderHabitItem = (item, onChange) => (
    <TouchableOpacity
      key={item.id || item.name}
      className="p-3 bg-background-70 items-center rounded-xl flex-row gap-2 top-0"
      onPress={(e) => {
        e.stopPropagation();
        onChange(item.id);
      }}
    >
      <View className="gap-1 flex-1">
        { item.id
        ? <View>
            <View className="flex-row items-center justify-between">
                <Text className="text-highlight-90 text-xl">{item.name}</Text>
                <Text className="text-highlight-70 text-xs font-medium">{formatRepeatText(item.repeat)}</Text>
              </View>
              <Text className="text-highlight-70">{item.completionCount} / {item.goal} {item.label}</Text>
          </View>
        : <Text className="text-highlight-90 text-xl">{item.name}</Text>
        }

        
      </View>
    </TouchableOpacity>
  )

  const RenderHabitButton = useCallback((isDisabled, disabledPlaceholder, placeholder) => {
    const [currentHabit, setCurrentHabit] = useState({})

    useEffect(() => {
      setCurrentHabit(options.find(habit => habit.id === value))
    }, [value])
    
    return (
        <View>
          {value ? 
            <View className="justify-between">
              <Text className="text-highlight-90 text-xl">{currentHabit.name}</Text>
              <Text className="text-highlight-70">{currentHabit.completionCount} / {currentHabit.goal} {currentHabit.label}</Text>
            </View>
            : isDisabled ? 
            <Text className='text-xl text-highlight-60'>{disabledPlaceholder}</Text>
            : 
            <Text className='text-xl text-highlight-90'>{placeholder}</Text>
          }
        </View>
    )
  }, [options, isOpen, value])

  return (
    <DropdownMenu 
      value={value}
      onChange={onChange}
      options={options}
      handleOpen={handleOpen}
      id={id}
      isOpen={isOpen}
      isCustom={isCustom}
      handleCreateNew={handleCreateNew}
      renderItem={RenderHabitItem}
      renderButton={RenderHabitButton}
      placeholder='Select a habit'
      disabledPlaceholder='No habits available'
    />
  )
}

export default HabitsDropdown