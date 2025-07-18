export default {
  "expo": {
    "name": "NoRedo",
    "slug": "noredo",
    "scheme": "noredo",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "icon": {
        "light": "./assets/icons/app/ios-light.png",
        "dark": "./assets/icons/app/ios-dark.png",
        "tinted": "./assets/icons/app/ios-tinted.png"
      },
      "bundleIdentifier": "com.lujo.noredo",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      },
      "runtimeVersion": {
        "policy": "appVersion"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icons/app/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.lujo.noredo",
      "runtimeVersion": "1.0.0"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-sqlite",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#ffffff",
          "image": "./assets/icons/app/splash-icon-dark.png",
          "dark": {
            "image": "./assets/icons/app/splash-icon-light.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 200
        }
      ],
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/GeneralSans/GeneralSans-Regular.otf",
            "./assets/fonts/GeneralSans/GeneralSans-Italic.otf",
            "./assets/fonts/GeneralSans/GeneralSans-Medium.otf",
            "./assets/fonts/GeneralSans/GeneralSans-MediumItalic.otf",
            "./assets/fonts/GeneralSans/GeneralSans-Semibold.otf",
            "./assets/fonts/GeneralSans/GeneralSans-SemiboldItalic.otf",
            "./assets/fonts/GeneralSans/GeneralSans-Bold.otf",
            "./assets/fonts/GeneralSans/GeneralSans-BoldItalic.otf",
            "./assets/fonts/GeneralSans/GeneralSans-Light.otf",
            "./assets/fonts/GeneralSans/GeneralSans-LightItalic.otf",
            "./assets/fonts/GeneralSans/GeneralSans-Extralight.otf",
            "./assets/fonts/GeneralSans/GeneralSans-ExtralightItalic.otf",
            "./assets/fonts/SourceSans/SourceSans3-Black.ttf",
            "./assets/fonts/SourceSans/SourceSans3-BlackItalic.ttf",
            "./assets/fonts/SourceSans/SourceSans3-ExtraBold.ttf",
            "./assets/fonts/SourceSans/SourceSans3-ExtraBoldItalic.ttf",
            "./assets/fonts/SourceSans/SourceSans3-Bold.ttf",
            "./assets/fonts/SourceSans/SourceSans3-BoldItalic.ttf",
            "./assets/fonts/SourceSans/SourceSans3-SemiBold.ttf",
            "./assets/fonts/SourceSans/SourceSans3-SemiBoldItalic.ttf",
            "./assets/fonts/SourceSans/SourceSans3-Medium.ttf",
            "./assets/fonts/SourceSans/SourceSans3-MediumItalic.ttf",
            "./assets/fonts/SourceSans/SourceSans3-Regular.ttf",
            "./assets/fonts/SourceSans/SourceSans3-Italic.ttf",
            "./assets/fonts/SourceSans/SourceSans3-Light.ttf",
            "./assets/fonts/SourceSans/SourceSans3-LightItalic.ttf",
            "./assets/fonts/SourceSans/SourceSans3-ExtraLight.ttf",
            "./assets/fonts/SourceSans/SourceSans3-ExtraLightItalic.ttf",
            "./assets/fonts/Lora/Lora-Bold.ttf",
            "./assets/fonts/Lora/Lora-BoldItalic.ttf",
            "./assets/fonts/Lora/Lora-SemiBold.ttf",
            "./assets/fonts/Lora/Lora-SemiBoldItalic.ttf",
            "./assets/fonts/Lora/Lora-Medium.ttf",
            "./assets/fonts/Lora/Lora-MediumItalic.ttf",
            "./assets/fonts/Lora/Lora-Regular.ttf",
            "./assets/fonts/Lora/Lora-Italic.ttf"
          ]
        }
      ]
    ],
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "e77a11eb-ea72-4d6d-b6ae-e44d86e87256"
      }
    },
    "updates": {
      "url": "https://u.expo.dev/29a6a3a7-acf7-4fd4-95d7-b55578581150"
    },
    "owner": "lujo"
  }
};