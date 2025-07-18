import { View, Text, SafeAreaView, Image } from "react-native";
import Header from "../../../components/Text/Header";
import { useAuth } from "../../../contexts/AuthContext";
import Subheader from "../../../components/Text/Subheader";
import BasicContainer from "../../../components/containers/BasicContainer";
import TextButton from "../../../components/TextButton";
import { Link } from "expo-router";
import icons from "../../../constants/icons"
import tailwindConfig from "../../../tailwind.config";

const tailwindColors = tailwindConfig.theme.extend.colors;

const Account = () => {
  const { user, userProfile, signout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-start items-center p-4 gap-4">
        <Header>Profile</Header>
        <View className="flex justify-between items-start w-full">
          <BasicContainer className="mb-4">
            <Header>{userProfile.displayName || "Set a display name"}</Header>
            <Subheader>@{userProfile.username}</Subheader>
          </BasicContainer>
          <Header>Account Details</Header>
          <BasicContainer className="mb-4 gap-4">
            <Link href={"/settings/personalInfo"}>
              <View className="flex-row justify-between items-center w-full">
                <View>
                  <Header>Personal Info</Header>
                  <Subheader>Change username, email and password</Subheader>
                </View>
                <Image
                  source={icons.arrowRightSLine}
                  className="w-9 h-9"
                  resizeMode="cover"
                  tintColor={tailwindColors["highlight"]["90"]}
                />
              </View>
            
            </Link>
          </BasicContainer>
          <Header>Help and Support</Header>
          <BasicContainer className="gap-4">
            <Link href={"persionalInfo"}>
              <Subheader>Help Center</Subheader>
            </Link>
            <Link href={"persionalInfo"}>
              <Subheader>FaQ</Subheader>
            </Link>

            <View className="flex-row">
              <TextButton
                type={"outline"}
                text={"Sign Out"}
                onPress={signout}
              />
            </View>
          </BasicContainer>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Account;
