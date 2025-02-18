import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import DateSelectorIcon from './DateSelectorIcon'

const DateSelector = ({ start, end, currentDate, setDate }) => {

  const generateDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates;
  }

  const dates = useMemo(() => {
    return generateDates( start, end )
  }, [start, end])

  const renderItem = useCallback(({item}) => {
    return (
      <View className="mr-2">
        <DateSelectorIcon date={item} currentDate={currentDate} setDate={setDate} />
      </View>
    )
  }, [])

  return (
    <View className="pt-2 pb-2">
      <FlatList
        data={dates}
        keyExtractor={item => item.getTime().toString()}
        renderItem={renderItem}
        horizontal
        initialNumToRender={15}
        windowSize={5}
      />
    </View>
  )
}

export default DateSelector