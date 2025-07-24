import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { SafeAreaView, Text } from "react-native";
import { account, config, databases, ID } from "../lib/appwriteConfig";
import {
  checkForUserName,
  createUserProfile,
  getUserProfile,
} from "../lib/appwriteManager";
import Header from "../components/Text/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

// DO NOT REMOVE THE CODE COMMENTED HERE EVER
// FIX ME: uncomment when ready to implement
// import * as AppleAuthentication from "expo-apple-authentication";
// import * as WebBrowser from "expo-web-browser";
// import * as Linking from "expo-linking";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await checkAuth();
  };

  const checkAuth = async () => {
    try {
      const responseSession = await account.getSession("current");
      setSession(responseSession);

      const responseUser = await account.get();
      setUser(responseUser);

      // Try to get user profile

      console.log("r", responseUser.$id);
      try {
        const responseUserProfile = await getUserProfile(responseUser.$id);
        setUserProfile(responseUserProfile);

        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

        if (hasOnboarded !== "true") {
          if (responseUserProfile?.hasOnboarded === true) {
            await AsyncStorage.setItem("hasOnboarded", "true");
          } else {
            await AsyncStorage.setItem("hasOnboarded", "false");
          }
        }
      } catch (profileError) {
        console.log(
          "No user profile found, this is normal for new users",
          profileError
        );
      }
    } catch (error) {
      setSession(null);
      setUser(null);
      setUserProfile(null);
    }
    setIsLoading(false);
  };

  // DO NOT REMOVE THE CODE COMMENTED HERE EVER
  // FIX ME: uncomment when ready to implement
  // useEffect(() => {
  //   const sub = Linking.addEventListener("url", async ({ url }) => {
  //     if (url.startsWith("noredo://auth")) {
  //       try {
  //         const responseSession = await account.getSession("current");
  //         setSession(responseSession);

  //         const responseUser = await account.get();
  //         setUser(responseUser);

  //         const responseUserProfile = await getUserProfile(responseUser.$id);
  //         setUserProfile(responseUserProfile);
  //       } catch (e) {
  //         console.log("Error completing Apple login redirect", e);
  //       }
  //     }
  //   });

  //   return () => sub.remove();
  // }, []);

  const signin = async ({ email, password }) => {
    try {
      const responseSession = await account.createEmailPasswordSession(
        email,
        password
      );
      console.log("SESSION", responseSession);
      setSession(responseSession);

      const responseUser = await account.get();
      setUser(responseUser);

      // Try to get user profile
      try {
        const responseUserProfile = await getUserProfile(responseUser.$id);
        setUserProfile(responseUserProfile);
      } catch (profileError) {
        console.log("No user profile found");
        setUserProfile(null);
      }
    } catch (error) {
      //console.error("Failed to sign in user", JSON.stringify(error), error.message);

      throw new Error(getErrorMessage(error));
    }
  };

  const signout = async () => {
    setIsLoading(true);

    console.log("AUTHCONTEXT.JSX - signing out user");
    //await AsyncStorage.setItem("hasOnboarded", "false"); //FIX ME uncomment for testing onboarding screen
    setSession(null);
    setUser(null);
    setUserProfile(null);

    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Error signing out:", error);
    }

    setIsLoading(false);
  };

  const signup = async ({ username, email, password }) => {
    const userId = ID.unique();

    try {
      // Check if username is taken before proceeding
      await checkForUserName(userId, username);

      const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).*$/;
      const safePassword = password.match(regex);

      if (!safePassword) {
        throw new Error(
          "Password must include 1 upper case letter, 1 lower case letter, 1 number and 1 special character."
        );
      }

      // Create account first, so we don't create a profile for a failed signup
      await account.create(userId, email, password);

      // If account creation succeeds, create user profile
      const userProfile = await createUserProfile(userId, username, "");
      setUserProfile(userProfile);

      // Create session
      const responseSession = await account.createEmailPasswordSession(
        email,
        password
      );
      setSession(responseSession);

      console.log("SESSION", responseSession);

      // Get user data
      const responseUser = await account.get();
      setUser(responseUser);

      const userArchetypeString = await AsyncStorage.getItem("userArchetype");
      const areaPreferencesString = await AsyncStorage.getItem(
        "areaPreferences"
      );

      console.log(
        "creating user, pref data",
        userArchetypeString,
        areaPreferencesString
      );

      const userArchetype = userArchetypeString || null;
      const areaPreferences = areaPreferencesString
        ? JSON.parse(areaPreferencesString)
        : null;

      console.log("ONBOARDING DATA", userArchetype, areaPreferences);

      await databases.updateDocument(config.db, config.cols.users, userId, {
        "hasOnboarded": true,
        areaPreferences,
        userArchetype,
      });

      await AsyncStorage.setItem("hasOnboarded", true);
    } catch (error) {
      //console.error("Signup error:", JSON.stringify(error));

      throw new Error(getErrorMessage(error));
    }
  };

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const authUrl = account.createOAuth2Session(
        "apple",
        "noredo://auth",
        "noredo://auth"
      );

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        "noredo://auth"
      );

      if (result.type === "success") {
        // Wait for Appwrite to complete auth server-side
        const responseSession = await account.getSession("current");
        setSession(responseSession);

        const responseUser = await account.get();
        setUser(responseUser);

        try {
          const responseUserProfile = await getUserProfile(responseUser.$id);
          setUserProfile(responseUserProfile);
        } catch (profileError) {
          console.log("No user profile found for Apple login.");
        }
      }
    } catch (error) {
      console.log("Apple Sign-In Error:", error);
      throw error;
    }
  };

  const updateUsername = async (newUsername) => {
    if (!user) throw new Error("Not logged in");

    try {
      await checkForUserName(user.$id, newUsername);

      const updated = await databases.updateDocument(
        config.db,
        config.cols.users,
        user.$id,
        {
          username: newUsername,
        }
      );
      setUserProfile(updated);
    } catch (error) {
      throw error;
    }
  };

  const updateEmail = async (newEmail, password) => {
    try {
      const updated = await account.updateEmail(newEmail, password);
      setUser(updated);
    } catch (error) {
      console.error("Error updating email:", error.code);
      if (error.code === 401 || error.code === 400) {
        throw new Error("Incorrect password");
      }
      throw new Error(getErrorMessage(error));
    }
  };

  const updatePassword = async (newPassword, oldPassword) => {
    try {
      await account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

  const getErrorMessage = (error) => {
    if (error.code === 400) {
      if (error.message?.includes("email")) {
        return "You must enter a valid email";
      } else if (error.message?.includes("password")) {
        return "Password must be between 8 and 256 characters long.";
      }
    } else if (error.code === 409) {
      if (error.message?.includes("email")) {
        return "Email already in use";
      } else {
        return "Username already in use";
      }
    } else if (error.message?.includes("Database not found")) {
      return "Database configuration error. Please contact support.";
    } else {
      throw new Error(error.message);
    }
  };

  const contextData = useMemo(
    () => ({
      session,
      user,
      userProfile,
      isLoading,
      signin,
      signup,
      signout,
      signInWithApple,
      updateUsername,
      updateEmail,
      updatePassword,
    }),
    [session, user, userProfile, isLoading]
  );

  return (
    <AuthContext.Provider value={contextData}>
      {isLoading ? (
        <SafeAreaView className="flex-1 justify-center items-center bg-background"></SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
