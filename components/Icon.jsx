import icons from "../constants/icons";
import tailwindConfig from "../tailwind.config";
import { Image } from "react-native";

const tailwindColors = tailwindConfig.theme.extend.colors;

const Icon = ({ name, type }) => {


  const color =
    type === "error"
      ? tailwindColors["habitColors"]["red"]["DEFAULT"]
      : tailwindColors["highlight"]["90"];

  
  return (
    <Image
      source={icons[name]}
      className="w-9 h-9"
      resizeMode="cover"
      tintColor={color}
    />
  );
};

export default Icon;
