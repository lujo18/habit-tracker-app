import { Image, Text, View } from 'react-native'
import { Tabs } from 'expo-router'

import icons from '../../constants/icons'
import tailwindConfig from '../../tailwind.config'

const tailwindColors = tailwindConfig.theme.extend.colors

const TabIcon = ({icon, color, name, focused}) => {
  return (
    <View className="items-center justify-center gap-2 w-20">
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className={focused ? 'w-11 h-11' : 'w-9 h-9'}
      />
      <Text className={focused ? "text-highlight-60" : "text-background-90"}>{name}</Text>
    </View>
  )
}

const TabsLayout = () => {

  return (
    <> 
      
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: tailwindColors['highlight']['60'],
            tabBarInactiveTintColor: tailwindColors['background']['80'],
            tabBarStyle: {
              backgroundColor: tailwindColors['background']['DEFAULT'],
              borderTopWidth: 1,
              borderTopColor: tailwindColors['background']['90'],
              height: 92,
              paddingTop: 12
            }
          }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                      <TabIcon
                        icon={icons.fillCheck}
                        color={color}
                        name={"Home"}
                        focused={focused}
                      />
                    )
                }}
            />
            <Tabs.Screen
                name="journal"
                options={{
                    title: "Journal",
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                      <TabIcon
                        icon={icons.book}
                        color={color}
                        name={"Journal"}
                        focused={focused}
                      />
                    )
                }}
            />
            
            <Tabs.Screen
                name="analytics"
                options={{
                    title: "Analytics",
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                      <TabIcon
                        icon={icons.chart}
                        color={color}
                        name={"Analytics"}
                        focused={focused}
                      />
                    )
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: "Account",
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                      <TabIcon
                        icon={icons.settings}
                        color={color}
                        name={"Account"}
                        focused={focused}
                      />
                    )
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    href:null,
                    title: "Calendar",
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                      <TabIcon
                        icon={icons.calendar}
                        color={color}
                        name={"Calendar"}
                        focused={focused}
                      />
                    )
                }}
            />
        </Tabs>
     
    </>
  )
}

export default TabsLayout
