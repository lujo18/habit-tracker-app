import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from "react-native";
import Header from "../../../components/Text/Header";
import { useAuth } from "../../../contexts/AuthContext";
import Subheader from "../../../components/Text/Subheader";
import BasicContainer from "../../../components/containers/BasicContainer";
import TextButton from "../../../components/TextButton";
import { Link } from "expo-router";
import icons from "../../../constants/icons";
import tailwindConfig from "../../../tailwind.config";
import { useMemo, useState } from "react";
import BuildInput from "../../../components/BuildInput";
import PopupModalBase from "../../../components/PopupModalBase";
import BackArrow from "../../../components/BackArrow";

const tailwindColors = tailwindConfig.theme.extend.colors;

const PersonalInfo = () => {
  const {
    user,
    userProfile,
    signout,
    updateUsername,
    updateEmail,
    updatePassword,
    error,
  } = useAuth();

  const [editorOpen, setEditorOpen] = useState(0);

  const [newUsername, setNewUsername] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!user) {
    return null;
  }

  const handleSaveUsername = async () => {
    try {
      await updateUsername(newUsername);
      setEditorOpen(0);
    } catch (err) {
     
    }
  };

  const handleSaveEmail = async () => {
    try {
      await updateEmail(newEmail, currentPassword);
      setEditorOpen(0);
    } catch (err) {

    }
  };

  const handleSavePassword = async () => {
    try {
      await updatePassword(newPassword, currentPassword);
      setEditorOpen(0);
    } catch (err) {
     
    }
  };

  const tabs = useMemo(
    () => [
      {
        header: "Username",
        subheader: "@" + userProfile.username,
        editor: 1, // username editor
      },
      {
        header: "Email",
        subheader: user.email,
        editor: 2, // email editor
      },
      {
        header: "Password",
        subheader: "Change Password",
        editor: 3, // password editor
      },
    ],
    [user]
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-start items-center p-4 gap-4">
        <View className="flex-row w-full">
          <View className="flex-1"><BackArrow/></View>
          <View className="flex-1">
            <Header>Personal Info</Header>
          </View>
          <View className="flex-1"></View>
        </View>
        <View className="flex justify-between items-start w-full">
          <BasicContainer className="mb-4 gap-4">
            {tabs.map((tab, idx) => (
              <TouchableOpacity
                key={tab.header}
                className="flex-row justify-between items-center w-full"
                onPress={() => setEditorOpen(tab.editor)}
              >
                <View>
                  <Header>{tab.header}</Header>
                  <Subheader>{tab.subheader}</Subheader>
                </View>
                <Image
                  source={icons.arrowRightSLine}
                  className="w-9 h-9"
                  resizeMode="cover"
                  tintColor={tailwindColors["highlight"]["90"]}
                />
              </TouchableOpacity>
            ))}
          </BasicContainer>
          
        </View>
      </View>

      <PopupModalBase
        isVisible={editorOpen === 1}
        handleCancel={() => setEditorOpen(0)}
        handleSubmit={() => {
          handleSaveUsername();
        }}
        submitButtonText={"Confirm"}
      >
        <View className="p-4 w-full">
          <Header>Edit Username</Header>
          <Subheader>Current: @{userProfile.username}</Subheader>
          <View className="my-4 w-full">
            <Subheader>New Username</Subheader>

            <BuildInput
              placeholder="Enter new username"
              value={newUsername}
              onChangeText={setNewUsername}
              autoCapitalize="none"
            />
          </View>
          {error && (
            <Text className="font-generalsans-medium text-habitColors-red-up">
              {error.message}
            </Text>
          )}
        </View>
      </PopupModalBase>

      <PopupModalBase
        isVisible={editorOpen === 2}
        handleCancel={() => setEditorOpen(0)}
        handleSubmit={() => {
          handleSaveEmail();
        }}
        submitButtonText={"Confirm"}
      >
        <View className="p-4 w-full">
          <Header>Change Email</Header>
          <Subheader>Current: {user.email}</Subheader>
          <View className="my-4 w-full">
            <Subheader>New Email</Subheader>

            <BuildInput
              placeholder="Enter new email"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType={
                Platform.OS === "ios" ? "username" : "emailAddress"
              }
              importantForAutofill="yes"
            />
          </View>
          <View className="my-4 w-full">
            <Subheader>Enter Current Password</Subheader>

            <BuildInput
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType={
                Platform.OS === "ios" ? "newPassword" : "password"
              }
              importantForAutofill="yes"
            />
          </View>
          {error && (
            <Text className="font-generalsans-medium text-habitColors-red-up">
              {error.message}
            </Text>
          )}
        </View>
      </PopupModalBase>

      <PopupModalBase
        isVisible={editorOpen === 3}
        handleCancel={() => setEditorOpen(0)}
        handleSubmit={() => {
          handleSavePassword();
        }}
        submitButtonText={"Confirm"}
      >
        <View className="p-4 w-full">
          <Header>Change Password</Header>
          <View className="my-4 w-full">
            <Subheader>Enter Current Password</Subheader>

            <BuildInput
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType={
                Platform.OS === "ios" ? "newPassword" : "password"
              }
              importantForAutofill="yes"
            />
          </View>
          <View className="my-4 w-full">
            <Subheader>New Password</Subheader>

            <BuildInput
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              textContentType={
                Platform.OS === "ios" ? "newPassword" : "password"
              }
              importantForAutofill="yes"
            />
          </View>
          {error && (
            <Text className="font-generalsans-medium text-habitColors-red-up">
              {error.message}
            </Text>
          )}
        </View>
      </PopupModalBase>
    </SafeAreaView>
  );
};

export default PersonalInfo;
