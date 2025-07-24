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

const signin = () => {
  const { signin } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (localError) {
      setLocalError(null);
    }
  }, [username, email, password]);

  const handleSignIn = async () => {
    try {
      await signin({ email, password });
    } catch (err) {
      setLocalError(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 flex w-full bg-background p-4 gap-4">
        <KeyboardAvoidingView
          className="flex justify-start items-center gap-4 w-full h-full flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="w-full justify-center items-center">
            <Header>NoRedo</Header>
          </View>
          <View className="flex-1 w-full items-center justify-center">
            <View className="mb-8 items-center gap-2">
              <XLHeader>Log Into Account</XLHeader>
              <Subheader>Enter your information to log in.</Subheader>
            </View>
            <View className="w-full flex gap-4">
              {/* <BuildInput
                placeholder={"Username"}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              /> */}

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
                textContentType={"password"}
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
                  text={"Sign In"}
                  onPress={handleSignIn}
                  disabled={!email || !password}
                />
              </View>
            </View>
            <Link href={"/auth/signup"}>
              <Text className="text-highlight-60 font-generalsans-medium">
                New here? Sign up
              </Text>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default signin;
