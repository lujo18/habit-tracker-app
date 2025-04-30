import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DateSelectorIcon from './DateSelectorIcon'
import { generateDates } from '../utils/dateRetriver'

const DateSelector = ({ start, end, currentDate, setDate }) => {

  const flatListRef = useRef(null);

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
        <DateSelectorIcon date={item} currentDate={currentDate} setDate={setDate} />
      </View>
    )
  }, [currentDate])

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
      />
    </View>
  )
}


export default DateSelector