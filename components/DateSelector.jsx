import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DateSelectorIcon from './DateSelectorIcon'
import { generateDates } from '../utils/dateRetriver'
import { useDateContext } from '../contexts/DateContext'

const DateSelector = ({ start, end }) => {

  const flatListRef = useRef(null);
  
  const {selectedDate, setSelectedDate} = useDateContext();

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: false });
      }, 0);
    }
  }, [dates]);

  const dates = useMemo(() => {
    return generateDates(start, end)
  }, [start, end])

  const renderItem = useCallback(({item}) => {
    return (
      <View className="mr-2">
        <DateSelectorIcon date={item} currentDate={selectedDate} setDate={setSelectedDate} />
      </View>
    )
  }, [selectedDate])

  return (
    <View className="pt-2 pb-2">
      <FlatList
        data={[...dates].reverse()}
        inverted
        keyExtractor={item => item.getTime().toString()}
        renderItem={renderItem}
        horizontal
        initialNumToRender={15}
        windowSize={5}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}


export default DateSelector