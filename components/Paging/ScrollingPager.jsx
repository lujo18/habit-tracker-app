import { View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native'
import React, { useState, useRef } from 'react'
import PagerView from 'react-native-pager-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextButton from '../TextButton'
import AnimatedNavbar from './AnimatedNavbar'


const {width: screenWidth} = Dimensions.get('window')

const ScrollingPager = ({children}) => {
  const flatListRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)


  const childrenArray = React.Children.toArray(children)

  const data = childrenArray.map((child, index) => {
    if (React.isValidElement(child)) {
      return {
        id: child.key || index.toString(),
        component: child,
        pageTitle: child.props.pageTitle
      }
    }
    return null
  }).filter(Boolean) || []


  const renderItem = ({ item }) => (
    <View className= 'w-[100vw] flex-1 px-8 py-4 pb-60'>
      {item.component}
    </View>
  )

  const onScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width
    const index = event.nativeEvent.contentOffset.x / slideSize
    const roundedIndex = Math.round(index)

    // Only update currentIndex if the scroll has settled on a new page (not during fast swipes)
    if (
      roundedIndex !== currentIndex &&
      roundedIndex >= 0 &&
      roundedIndex < data.length
    ) {
      setCurrentIndex(roundedIndex)
    }
  }

  const goToSlide = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true })
    setCurrentIndex(index)
  }

  return (
    <ScrollView className="flex-1 w-full bg-background">
      
   
      <AnimatedNavbar pages={data.map((page) => page.pageTitle)} activePage={currentIndex} setActivePage={goToSlide}/>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onScroll={onScroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate={"fast"}
        snapToInterval={screenWidth}
        snapToAlignment='start'
        contentContainerStyle={{width: "100vw"}}
      />
    </ScrollView>
  )
}

export default ScrollingPager