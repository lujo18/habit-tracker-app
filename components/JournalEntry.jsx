import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import icons from '../constants/icons';
import WebView from 'react-native-webview';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const JournalEntry = ({ id, date, title, body, habitId, editEntry, habitName, habitColor }) => {
  //const bodyHeight = useSharedValue(60); // Start with a limited height (e.g., 3 lines of text)
  const [contentHeight, setContentHeight] = useState(60); // Default to VISIBLE_TEXT_HEIGHT
  const isExpanded = useSharedValue(false) // Track whether the WebView is expanded

  const VISIBLE_TEXT_HEIGHT = 60; // Height for 3 lines of text

  // Animated style for the WebView
  const animatedStyle = useAnimatedStyle(() => {
    //console.log("Animated content height: ", withTiming(bodyHeight.value, { duration: 300 }))
    return {
      height: withTiming(isExpanded.value ? contentHeight : contentHeight < VISIBLE_TEXT_HEIGHT ? contentHeight : VISIBLE_TEXT_HEIGHT, { easing: Easing.out(Easing.exp), duration: 600 }), // Smooth animation
    };
  });


  return (
    <View className="w-full border-2 rounded-xl py-4 px-8 justify-center mb-4 flex-row gap-4 bg-background-80">
      <View className="flex-1">
        <Text className="text-highlight-90 text-lg font-semibold">{title}</Text>
        <View className="flex-row items-center gap-3">
          <Text className="text-highlight-60">{date.substring(0, date.indexOf(' '))}</Text>

          {habitName && (
            <View
              className="py-1 px-2 border-2 rounded-full"
              style={{ backgroundColor: habitColor }}
            >
              <Text className="text-highlight">{habitName}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (contentHeight > VISIBLE_TEXT_HEIGHT) {
              isExpanded.value = !isExpanded.value; // Toggle expanded state
              //bodyHeight.value = isExpanded.value ? VISIBLE_TEXT_HEIGHT : contentHeight; // Animate height
            }
          }}
        >

          <Animated.View
            style={animatedStyle}
          >
            <WebView
              originWhitelist={['*']}
              javaScriptEnabled={true} // Ensure JavaScript is enabled
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                          color: #ffffff; /* Ensure text is visible */
                          margin: 0;
                          padding: 0;
                          overflow: hidden; /* Disable scrolling */
                        }
                      </style>
                    </head>
                    <body>
                      ${body}
                      <script>
                        setTimeout(() => {
                          const height = document.body.scrollHeight;
                          console.log("Calculated Height:", height); // Debugging log
                          window.ReactNativeWebView.postMessage(height);
                        }, 100); // Delay to ensure content is fully loaded
                      </script>
                    </body>
                  </html>
                `,
              }}
              style={[{ backgroundColor: 'transparent' }]} // Apply animated style
              onMessage={(event) => {
                const height = parseInt(event.nativeEvent.data, 10);
                console.log('Received Height from WebView:', height); // Debugging log
                if (!isNaN(height) && height > 0) {
                  setContentHeight(height); // Store the full content height
                  
                } else {
                  console.log('Invalid height received from WebView'); // Debugging log
                }
              }}
              scrollEnabled={false} // Disable scrolling
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {editEntry(id, date, title, body, habitId); isExpanded.value = false}}
          className="bg-background-80 p-4"
        >
          <Image source={icons.editEntry} />
          <Text className="text-highlight-80">Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JournalEntry;
