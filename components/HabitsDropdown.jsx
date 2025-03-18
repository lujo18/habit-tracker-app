import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
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

  const renderHabitItem = (item, onSelect) => (
    <TouchableOpacity
      key={item.id || item.name}
      className="p-3 bg-background-70 items-center rounded-xl flex-row gap-2 top-0"
      onPress={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
    >
      <View className="gap-1 flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-highlight-90 text-xl">{item.name}</Text>
          <Text className="text-highlight-70 text-xs font-medium">{formatRepeatText(item.repeat)}</Text>
        </View>
        <Text className="text-highlight-70">{item.completionCount} / {item.goal} {item.label}</Text>
      </View>
    </TouchableOpacity>
  )

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
      renderItem={renderHabitItem}
      placeholder='Select a habit'
      disabledPlaceholder='No habits available'
    />
  )
}

export default HabitsDropdown