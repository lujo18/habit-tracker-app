import { Permission, Query, Role } from "react-native-appwrite";
import { config, databases, ID } from "./appwriteConfig";

export async function createUserProfile(userId, username, displayName) {
  return await databases.createDocument(
    config.db,
    config.cols.users,
    userId,
    {
      username,
      displayName
    }
  )
}

export async function getUserProfile(userId) {
  return await databases.getDocument(config.db, config.cols.users, userId);
}

export async function checkForUserName(userId, newUsername) {
  const res = await databases.listDocuments(config.db, config.cols.users, [Query.equal("username", newUsername)])

  const duplicate = res.documents.find(doc => doc.$id != userId)
  if (duplicate) {
    throw new Error("Username already in use")
  }
}