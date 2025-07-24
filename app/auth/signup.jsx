import { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "../../components/Text/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import BuildInput from "../../components/BuildInput";
import TextButton from "../../components/TextButton";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "expo-router";
import XLHeader from "../../components/Text/XLHeader";
import Subheader from "../../components/Text/Subheader";
import { LinearGradient } from "expo-linear-gradient";

const signup = () => {
  const { signup, signInWithApple } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (localError) {
      setLocalError(null);
    }
  }, [username, email, password]);

  const handleSignUp = async () => {
    try {
      await signup({ username, email, password });
    } catch (err) {
      console.log("Caught err", err);
      setLocalError(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 flex w-full bg-background p-4 gap-4">
        <KeyboardAvoidingView
          className="flex justify-start items-center w-full h-full flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className={`w-full justify-center items-center`}>
            <Header>NoRedo</Header>
          </View>
          <View className="flex-1 w-full items-center justify-center">
            <View className="mb-8 items-center gap-2">
              <XLHeader>Create NoRedo Account</XLHeader>
              <Subheader>Create your account to begin your journey.</Subheader>
            </View>
            <View className="w-full flex gap-4">
              <BuildInput
                placeholder={"Username"}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                error={localError?.message.toLowerCase().includes("username")}
              />
              <BuildInput
                placeholder={"Email"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType={"username"}
                importantForAutofill="yes"
                error={localError?.message.toLowerCase().includes("email")}
              />
              <BuildInput
                placeholder={"Password"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType={"newPassword"}
                importantForAutofill="yes"
                error={localError?.message.toLowerCase().includes("password")}
              />
              {localError && (
                <Text className="font-generalsans-medium text-habitColors-red-up">
                  {localError.message}
                </Text>
              )}
              <View className="flex-row">
                <TextButton
                  type={"solid"}
                  text={"Create Account"}
                  onPress={handleSignUp}
                  disabled={!username || !email || !password}
                />
              </View>
            </View>
            {/* 
              // DO NOT REMOVE THE CODE COMMENTED HERE EVER
              // FIX ME: uncomment when ready to implement
            <View>
               <TextButton
                  type={"solid"}
                  text={"Sign Up with Apple"}
                  onPress={signInWithApple}
                  
                />
            </View> */}
            <Link href={"/auth/signin"}>
              <Text className="text-highlight-60 font-generalsans-medium">
                Have an account? Log in
              </Text>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default signup;
