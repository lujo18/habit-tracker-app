import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Canvas, Fill, Shader, Skia, Rect, RoundedRect, LinearGradient } from '@shopify/react-native-skia';
import { useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';


const FancyContainer = ({children}) => {

  const time = useSharedValue(0);
  const [, setRerender] = useState(0);

  const [timeVal, setTimeVal] = useState(0)

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame;
    const animate = () => {
      time.value = (Date.now() - startTime) / 1000;
      setTimeVal(time.value)
      setRerender(t => t + 1); // Force re-render to update shader
      setTimeout(() => animationFrame = requestAnimationFrame(animate), 200);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);


  // Compile the shader and check for errors
  const source = Skia.RuntimeEffect.Make(`
    uniform float3 resolution;
uniform float time; // Add time uniform for animation

// Simple noise function for abstract shapes
float noise(float2 p) {
    return fract(sin(dot(p, float2(12.9898, 78.233))) * 43758.5453);
}

// Fractal noise for more complex patterns
float fractalNoise(float2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

half4 main(float2 fragCoord) {
    // Normalize coordinates
    float2 uv = fragCoord / resolution.xy;
    
    // Create abstract, organic shapes instead of perfect circles
    float2 purpleCenter = float2(0.9, 1.5);
    float2 blueCenter = float2(0.15, 1.5);
    
    // Add noise and distortion to make shapes more abstract
    float noiseScale = 2.0;
    float2 noiseOffset = float2(time * 0.1, time * 0.05);
    
    // Distort the distance calculation with noise
    float2 purpleDistorted = uv - purpleCenter;
    purpleDistorted += fractalNoise(uv * noiseScale + noiseOffset) * 0.4;
    float purpleDist = length(purpleDistorted);
    
    float2 blueDistorted = uv - blueCenter;
    blueDistorted += fractalNoise(uv * noiseScale * 1.3 + noiseOffset * 1.5) * 0.25;
    float blueDist = length(blueDistorted);
    
    // Create asymmetric falloff patterns
    float purpleGradient = smoothstep(0.0, 1.4, purpleDist);
    float blueGradient = smoothstep(0.0, 1.2, blueDist);
    
    // Add directional bias to make gradients less symmetrical
    float purpleBias = sin(atan(purpleDistorted.y, purpleDistorted.x) * 3.0) * 0.3;
    float blueBias = cos(atan(blueDistorted.y, blueDistorted.x) * 3.0) * 0.2;
    
    purpleGradient += purpleBias;
    blueGradient += blueBias;
    
    // Clamp values
    purpleGradient = clamp(purpleGradient, 0.0, 1.0);
    blueGradient = clamp(blueGradient, 0.0, 1.0);
    
    // Define colors with more vibrant tones
    half3 topColor = half3(0.02, 0.02, 0.05);      // Dark navy/black
    half3 purpleMiddle = half3(0.3, 0.1, 0.5);     // Purple
    half3 purpleBright = half3(1.2, 0.4, 1.4);     // Bright glowing magenta
    half3 purpleBottom = half3(0.9, 0.3, 1.2);     // Bright purple
    
    // Blue gradient colors
    half3 blueMiddle = half3(0.1, 0.2, 0.5);       // Blue
    half3 blueBright = half3(0.4, 0.8, 1.4);       // Bright glowing blue
    half3 blueBottom = half3(0.3, 0.6, 1.2);       // Bright blue
    
    // Purple gradient
    half3 purpleColor;
    if (purpleGradient < 0.2) {
        float t = purpleGradient / 0.2;
        purpleColor = mix(purpleBottom, purpleBright, t);
    } else if (purpleGradient < 0.5) {
        float t = (purpleGradient - 0.2) / 0.3;
        purpleColor = mix(purpleBright, purpleMiddle, t);
    } else {
        float t = (purpleGradient - 0.5) / 0.5;
        purpleColor = mix(purpleMiddle, topColor, t);
    }
    
    // Blue gradient
    half3 blueColor;
    if (blueGradient < 0.2) {
        float t = blueGradient / 0.2;
        blueColor = mix(blueBottom, blueBright, t);
    } else if (blueGradient < 0.5) {
        float t = (blueGradient - 0.2) / 0.3;
        blueColor = mix(blueBright, blueMiddle, t);
    } else {
        float t = (blueGradient - 0.5) / 0.5;
        blueColor = mix(blueMiddle, topColor, t);
    }
    
    // Create abstract blending instead of linear horizontal blend
    float abstractBlend = fractalNoise(uv * 1.5 + float2(time * 0.02, 0.0)) * 0.4 + 0.6;
    abstractBlend *= smoothstep(0.1, 0.7, uv.x);
    abstractBlend = clamp(abstractBlend, 0.0, 1.0);
    
    half3 color = mix(blueColor, purpleColor, abstractBlend);
    
    // Aurora light effect with more organic movement
    float auroraTime = time * 0.3;
    
    // Create flowing aurora bands with noise
    float aurora1 = sin(uv.y * 3.0 + auroraTime + uv.x * 1.5 + fractalNoise(uv * 2.0) * 2.0) * 0.5 + 0.5;
    float aurora2 = sin(uv.y * 4.0 - auroraTime * 1.2 + uv.x * 2.0 + fractalNoise(uv * 1.5 + float2(time * 0.1, 0.0)) * 1.5) * 0.5 + 0.5;
    
    // Combine aurora effects with vertical falloff
    float auroraIntensity = (1.0 - uv.y) * 0.2;
    float auroraEffect = (aurora1 * 0.5 + aurora2 * 0.5) * auroraIntensity;
    
    // Aurora colors that blend between blue and purple
    half3 auroraColor1 = half3(0.8, 0.6, 1.2);  // Light purple
    half3 auroraColor2 = half3(0.6, 0.8, 1.2);  // Light blue
    
    // Mix aurora colors based on abstract blend
    half3 finalAurora = mix(auroraColor2, auroraColor1, abstractBlend);
    
    // Apply aurora effect as overlay
    color = mix(color, finalAurora, auroraEffect * 0.2);
    
    // Add enhanced glow effect with abstract patterns
    float glowIntensity = (.9 - min(purpleGradient, blueGradient)) * 0.5;
    glowIntensity *= (1.0 + fractalNoise(uv * 3.0 + float2(time * 0.05, 0.0)) * 0.3);
    half3 glowColor = mix(half3(0.1, 0.7, 1.0), half3(0.8, 0.5, 1.0), abstractBlend);
    color += glowColor * glowIntensity;
    
    return half4(color, 1.0);
}
  `);

  // Only use the shader if it compiled successfully



  const [size, setSize] = useState({width: 0, height: 0})

  return (
    <View
      className='w-full relative p-4 rounded-xl bg-background shadow-lg shadow-indigo-700/50 border-b-hairline'
      onLayout={(event) => {
        const {width, height} = event.nativeEvent.layout
        setSize({width, height})
      }}
    >

      {size.width > 0 && (
      <Canvas className='rounded-xl' style={{position: "absolute"}} width={size.width} height={size.height}>
        <RoundedRect
          x={0}
          y={0}
          width={size.width}
          height={size.height}
          r={15} // radius of corner
        >
          <LinearGradient 
            start={{ x: 0, y: size.height/2 }}
            end={{ x: 0, y: size.height*1.5 }}
            colors={['black', "#cda7db"]}
          />
          
        </RoundedRect>
        <RoundedRect
          x={2}
          y={2}
          width={size.width - 4}
          height={size.height - 4}
          r={15} // radius of corner
          color={"black"}
        >
          <Rect x={0} y={0} width={size.width - 4} height={size.height - 4} color="black" />
              
        </RoundedRect>
        <RoundedRect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            r={15} // radius of corner
            
          >
            
              {source ? (
                
                <Shader source={source} uniforms={{
                  "resolution": [size.width, size.height, 1.0],
                  "time": timeVal
                }}/>
              ) : (
                null
              )}
          
          </RoundedRect>
      </Canvas>
      )}
      
          {children}
      

      
    </View>
  )
}

export default FancyContainer