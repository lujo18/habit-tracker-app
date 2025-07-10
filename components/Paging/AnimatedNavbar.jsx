import { View, Text, TouchableOpacity } from 'react-native'
import React, {memo, useEffect, useState, useRef, useCallback, act} from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'

const AnimatedNavbar = ({pages, activePage, setActivePage}) => {
  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });
  const [activeButtonPosition, setActiveButtonPosition] = useState({ x: 0, y: 0 });
  const [activeButton, setActiveButton] = useState(0)

  const animatedX = useSharedValue(0)

  useEffect(() => {
    animatedX.value = withTiming(activeButtonPosition.x, { duration: 500, easing: Easing.out(Easing.exp) });
  }, [activeButtonPosition.x]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedX.value }],
  }));

  const NavButton = useCallback(({page, index}) => {
    const [position, setPosition] = useState({x: 0, y: 0});
   
    useEffect(() => {
      if (
        activePage === index &&
        (activeButtonPosition.x !== position.x || activeButtonPosition.y !== position.y) &&
        position.x !== 0 && position.y !== 0
      ) {
        setActiveButtonPosition(position)
        setActiveButton(index)
      }
    }, [activePage, index, activeButtonPosition, position]);

    return (
      <TouchableOpacity
        className='flex-1 justify-center items-center p-2 box-content'
      
        onPress={() => {
          if (activePage != index) {
            setActivePage(index);
          }
        }}
        onLayout={event => {
      
          const { width, height } = event.nativeEvent.layout;
          event.target.measure((fx, fy, w, h, px, py) => {
            if (buttonSize.width === 0 && buttonSize.height === 0) {
              setButtonSize({ width, height });
            }
            if (position.x === 0 && position.y === 0) {
              setPosition({ x: px, y: py });
            }
            if (index === activePage && activeButtonPosition.x === 0 && activeButtonPosition.y === 0) {
              setActiveButtonPosition({ x: px, y: py });
            }
          });

        }}
      >
        <Text className={`${index === activeButton ? 'text-highlight-60' : 'text-background-60'} font-generalsans-medium`}>
          {page} 
        </Text>
      </TouchableOpacity>
    );
  }, [activePage, activeButtonPosition]);

  return (
    <View className='flex flex-row px-2 py-2 m-6 mb-2 border-2 border-background-90 rounded-2xl justify-stretch items-center'>
      <Animated.View
        className='bg-background-80 absolute rounded-xl -m-6'
        style={[
          {
            width: buttonSize.width,
            height: buttonSize.height + 8,
          },
          animatedStyle,
        ]}
      />
      {pages.map((page, idx) => (
        <NavButton key={idx} page={page} index={idx} />
      ))}
    </View>
  );
};

export default memo(AnimatedNavbar)