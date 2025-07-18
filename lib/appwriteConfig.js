import { Platform } from "react-native";
import { Account, Client, Databases, ID } from "react-native-appwrite";

const devKey = "68783cb0001ae98272a3"

const config = {
  db : "68783cb0001ae98272a3",
  cols: {
    users : "68783cb4002ca1b00ca5",
  }
}

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setDevKey("68783cb0001ae98272a3")

switch(Platform.OS) {
  case "ios":
    client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID)
    break
  case "android":
    client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME)
    break
}

export const account = new Account(client)
export const databases = new Databases(client)
export const appwriteClient = client;
export {ID, config}