import { Dimensions } from 'react-native'
import { Canvas, Paint, RadialGradient, Rect, useClock, vec } from '@shopify/react-native-skia'
import { useDerivedValue } from 'react-native-reanimated'
import tailwindConfig from '../tailwind.config'
import { withTiming, useSharedValue } from 'react-native-reanimated'
import React from 'react'

const {width, height} = Dimensions.get("window")

const tailwindColors = tailwindConfig.theme.extend.colors

const RadialGlow = ({fullScreen = false}) => {
  const clock = useClock();

  const baseScale = useSharedValue(fullScreen ? 3 : 1);

  React.useEffect(() => {
    baseScale.value = withTiming(fullScreen ? 3 : 1, { duration: 600 });
  }, [fullScreen]);

  // animatedBase will smoothly animate between 0.7 and 3 based on fullScreen
  const animatedBase = useDerivedValue(() => baseScale.value, [baseScale]);

  const animatedRadius = useDerivedValue(() => {
    const t = clock.value / 1000;
    const base = width * animatedBase.value;
    const pulse = Math.sin(t * 1) * 50;
    return base + pulse;
  }, [clock, animatedBase]);

  const opacity = useDerivedValue(() => {
    const t = clock.value / 1000;
    return 0.25 + 0.1 * Math.sin(t * 2)
  }, [clock])


  // Adjust translateX to center the scaled gradient
  const scaleX = 1;
  const centerX = width/2;
  const adjustedTranslateX = centerX - (centerX * scaleX);
  const adjustedTranslateY = (height);

  return (
    <Canvas style={{ position: "absolute", width, height }}>
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient
          c={vec(width / 1.5, height * 1.05)}
          r={animatedRadius}
          colors={[
            `${tailwindColors["habitColors"]["blue"]["DEFAULT"]}`,
            `${tailwindColors["habitColors"]["blue"]["DEFAULT"]}00`
          ]}
          
        >
          <Paint opacity={opacity} />
        </RadialGradient>
      </Rect>
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient
          c={vec(width / 4, height * 1.2)}
          r={animatedRadius}
          colors={[tailwindColors["habitColors"]["blue"]["up"], `${tailwindColors["habitColors"]["blue"]["up"]}00`]}
         
        >
          <Paint opacity={opacity} />
        </RadialGradient>

      </Rect>
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient
          c={vec(width * 1.2, height * 1.3)}
          r={animatedRadius}
          colors={[tailwindColors["habitColors"]["blue"]["up"], `${tailwindColors["habitColors"]["blue"]["up"]}00`]}
         
        >
          <Paint opacity={opacity} />
        </RadialGradient>

      </Rect>
      
    </Canvas>
  )
}

export default RadialGlow