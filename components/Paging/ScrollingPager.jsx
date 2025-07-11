import { View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import PagerView from 'react-native-pager-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextButton from '../TextButton'
import AnimatedNavbar from './AnimatedNavbar'


const {width: screenWidth} = Dimensions.get('window')

const ScrollingPager = ({children, isControlled = false, currentPage}) => {
  const flatListRef = useRef(null)
  const [internalIndex, setInternalIndex] = useState(currentPage)

  const currentIndex = isControlled ? currentPage : internalIndex
  const setCurrentIndex = isControlled ? () => {} : setInternalIndex


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

  useEffect(() => {
    if (isControlled && typeof currentPage == "number") {
      goToSlide(currentPage)
    }
  }, [currentPage])


  const renderItem = ({ item }) => {
    // Add your desired props here
    const extraProps = {  showsVerticalScrollIndicator:false }

    // Clone the element with additional props
    const childWithProps = React.cloneElement(item.component, extraProps)

    return (
      <View className='w-[100vw] px-8 py-4'>
        {childWithProps}
      </View>
    )
  }

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

  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500))

    wait.then(() => {
      if (flatListRef.current && info.index < data.length) {
        flatListRef.current.scrollToIndex({ index: info.index, animated: false })
      }
    })
  }

  return (
    <View className='flex-1 w-full'>
    <ScrollView className="w-full bg-background" contentContainerStyle={{flexGrow: 1, justifyContent:"center"}}>
      <AnimatedNavbar
        pages={data.map((page) => page.pageTitle)}
        activePage={currentIndex || 0}
        setActivePage={isControlled ? () => {} : goToSlide}
      />
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
        snapToAlignment="start"
        contentContainerStyle={{ width: "100vw"}}
        scrollEnabled={!isControlled}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </ScrollView>
    </View>
  )
}

export default ScrollingPager