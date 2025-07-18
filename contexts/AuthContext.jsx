import { createContext, useContext, useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { account, config, databases, ID } from "../lib/appwriteConfig";
import { checkForUserName, createUserProfile, getUserProfile } from "../lib/appwriteManager";
import Header from "../components/Text/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await checkAuth();
  };

  const clearError = () => {
    setError(null);
  };

  const checkAuth = async () => {
    try {
      const responseSession = await account.getSession("current");
      setSession(responseSession);

      const responseUser = await account.get();
      setUser(responseUser);

      // Try to get user profile

      console.log("r", responseUser.$id)
      try {
        const responseUserProfile = await getUserProfile(responseUser.$id);
        setUserProfile(responseUserProfile);

        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded")

        if (hasOnboarded !== 'true') {
          if (responseUserProfile?.hasOnboarded === true) {
            await AsyncStorage.setItem("hasOnboarded", 'true');
          }
          else {
            await AsyncStorage.setItem("hasOnboarded", 'false');
          }
        }
        
      } catch (profileError) {
        console.log("No user profile found, this is normal for new users", profileError);
      }
    } catch (error) {
     
      setSession(null);
      setUser(null);
      setUserProfile(null);
    }
    setIsLoading(false);
  };

  const signin = async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const responseSession = await account.createEmailPasswordSession(
        email,
        password
      );
      console.log("SESSION", responseSession)
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
      console.error("Failed to sign in user", error, error.code);
      setError({
        message: getErrorMessage(error),
        target: "general",
      });
    }
    setIsLoading(false);
  };

  const signout = async () => {
    setIsLoading(true);

    console.log("AUTHCONTEXT.JSX - signing out user")

    setSession(null);
    setUser(null);
    setUserProfile(null);
    setError(null);

    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  

    setIsLoading(false);
  };

  const signup = async ({ username, email, password }) => {
    setIsLoading(true);
    setError(null);
    
    const userId = ID.unique();
    
    try {
      // Create account
      await account.create(userId, email, password);

      // Create session
      const responseSession = await account.createEmailPasswordSession(
        email,
        password
      );
      setSession(responseSession);

      console.log("SESSION", responseSession)

      // Get user data
      const responseUser = await account.get();
      setUser(responseUser);

      // Create user profile
      try {
        await checkForUserName(userId, username)

        const userProfile = await createUserProfile(userId, username, "");
        setUserProfile(userProfile);
      } catch (profileError) {
        console.error("Error creating user profile:", profileError);
        
        if (profileError.code === 409) {
          setError({
            message: "Username already in use",
            target: "username",
          });
        } else if (profileError.message?.includes("Database not found")) {
          setError({
            message: "Database configuration error. Please contact support.",
            target: "general",
          });
        } else {
          setError({
            message: "Failed to create user profile",
            target: "general",
          });
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.code === 409) {
        setError({
          message: "Email already in use",
          target: "email",
        });
      } else {
        setError({
          message: getErrorMessage(error),
          target: "general",
        });
      }
    }
    
    setIsLoading(false);
  };

  const updateUsername = async (newUsername) => {
    setError(null)
    if (!user) throw new Error("Not logged in");

    try {
      await checkForUserName(user.$id, newUsername)

      const updated = await databases.updateDocument(config.db, config.cols.users, user.$id, {
        username: newUsername,
      });
      setUserProfile(updated);
    } catch (error) {
      setError(error)
      throw error;
    }
  };

  const updateEmail = async (newEmail, password) => {
    try {
      const updated = await account.updateEmail(newEmail, password);
      setUser(updated);
    } catch (error) {
      if (error.code === 401 || error.code === 400) {
        setError({
        message: "Incorrect password",
        target: "password",
      });
      }

      setError({
        message: getErrorMessage(error),
        target: "general",
      });
      console.error("Error updating email:", error.code);
      throw error;
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
    switch (error.code) {
      case 409:
        return "This email is already registered";
      case 401:
        return "Invalid email or password";
      case 400:
        return "Please check your input and try again";
      case 429:
        return "Too many attempts. Please try again later";
      default:
        if (error.message?.includes("Database not found")) {
          return "Database configuration error. Please contact support.";
        }
        return error.message || "An unexpected error occurred";
    }
  };

  const contextData = {
    session,
    user,
    userProfile,
    isLoading,
    error,
    signin,
    signup,
    signout,
    updateUsername,
    updateEmail,
    updatePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {isLoading ? (
        <SafeAreaView className="flex-1 justify-center items-center bg-background">
          
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
