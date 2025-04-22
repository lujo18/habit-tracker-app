import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '../constants/icons'
import WebView from 'react-native-webview'

const JournalEntry = ({id, date, title, body, habitId, editEntry, habitName, habitColor}) => {
  const [bodyHeight, setBodyHeight] = useState(null)
  const [isActive, setIsActive] = useState(false);
  const VISIBLE_TEXT_HEIGHT = 3*20; // 20 is enough for a single line of characters
  
  return (
    <View className={`w-full border-2 rounded-xl py-4 px-8 justify-center mb-4 flex-row gap-4 bg-background-80`}>
      <View className="flex-1">
        <Text className="text-highlight-90 text-lg font-semibold">{title}</Text>
        <View className='flex-row items-center gap-3'>
          <Text className="text-highlight-60">{date.substring(0, date.indexOf(" "))}</Text>
          
          {habitName &&
            <View className={`py-1 px-2 border-2 rounded-full`} style={{ backgroundColor: habitColor }}>
              <Text className="text-highlight">{habitName}</Text>
            </View>
          }
        </View>
        <TouchableOpacity
          onPress={() => {setIsActive(!isActive)}}
          disabled={bodyHeight < VISIBLE_TEXT_HEIGHT}
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
                      // Debugging log inside the WebView
                      console.log("WebView content loaded");
                      setTimeout(() => {
                        const height = document.body.scrollHeight;
                        window.ReactNativeWebView.postMessage(height);
                      }, 100); // Delay to ensure content is fully loaded
                    </script>
                  </body>
                </html>
              `,
            }}
            style={{ height: isActive ? bodyHeight : bodyHeight < VISIBLE_TEXT_HEIGHT ? bodyHeight : VISIBLE_TEXT_HEIGHT, backgroundColor: 'transparent', overflow: 'hidden' }}
            onMessage={(event) => {
              const contentHeight = parseInt(event.nativeEvent.data, 10);
              
              if (!isNaN(contentHeight)) {
                setBodyHeight(contentHeight); // Update the height dynamically
              }
            }}
            scrollEnabled={false} // Disable scrolling
          />
        </TouchableOpacity>
        {/* <Text className="text-highlight-70">{body.substring(0, body.indexOf('\n') < 0 ? 100 : body.indexOf('\n'))}{body.length > 100 || (body.indexOf('\n') >= 0 && body.indexOf('\n') <= 100) ? "..." : null}</Text> */}
      </View>
      
      <View>
        <TouchableOpacity
        onPress={() => editEntry(id, date, title, body, habitId)}
        className="bg-background-80 p-4"
        >
          <Image
            source={icons.editEntry}
          />
          
          <Text className="text-highlight-80">Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default JournalEntry