import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import icons from "../constants/icons";
import SingleInputModal from "./SingleInputModal";
import Subheader from "./Text/Subheader";

const DropdownMenu = ({
  value, // Dropdown value passed in
  onChange, // Function to change dropdown value
  options, // Dropdown options
  handleOpen, // Changes the open menu state
  id, // unique menu # for determining isOpen
  isOpen,
  isCustom,
  handleCreateNew,
  renderItem,
  renderButton,
  customAddOption,
  placeholder = "Select an option",
  disabledPlaceholder = "No options available",
  maxHeight = 200,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleDropdown = () => {
    handleOpen(id); // sets open menu state to id
  };

  const handleModalOpen = () => {
    setModalOpen(!modalOpen); // toggles modal open state to opposite of current state
  };

  /**
   * Default render item for dropdown menu
   * @param {*} item
   * @param {*} onSelect
   * @returns
   */
  const defaultRenderItem = (item, onSelect) => (
    <TouchableOpacity
      key={item.id || item.name}
      className="p-3 bg-background-80 items-center rounded-xl flex-row gap-2 top-0"
      onPress={(e) => {
        e.stopPropagation();
        onSelect(item.name);
      }}
    >
      {item.icon && (
        <View>
          <Image source={item.icon} className="w-8 h-8" resizeMode="contain" />
        </View>
      )}

      <View>
        <Text className="text-highlight-90 text-xl font-generalsans-semibold">{item.name}</Text>

        {item.desc && <Subheader>{item.desc}</Subheader>}
      </View>
    </TouchableOpacity>
  );

  // Custom "add item" option for dropdown menu
  const defaultAddItem = () => (
    <TouchableOpacity
      key={"custom"}
      className="mb-2 p-3 bg-highlight items-center justify-center rounded-xl flex-row gap-2 top-0"
      onPress={(e) => {
        e.stopPropagation();
        handleModalOpen();
      }}
    >
      <View>
        <Image
          source={icons.add}
          className="w-8 h-8"
          resizeMode="contain"
          style={{ tintColor: "#000" }}
        />
      </View>
      <View className="gap-1">
        <Text className="text-background text-xl font-generalsans-medium">Add Option</Text>
      </View>
    </TouchableOpacity>
  );

  // Dropdown button component (toggles dropdown)
  const DropdownButton = useCallback(({ isDisabled }) => {

    return (
      <TouchableOpacity
        className={`flex-row border-2 border-background-80 p-4 items-center justify-between rounded-xl relative ${
          isDisabled ? "bg-background-80 opacity-80" : "bg-background-80"
        } ${isOpen ? "border-background-70 bg-transparent" : ""}`}
        onPress={isDisabled ? null : toggleDropdown}
      >
        {renderButton ? 
          renderButton(isDisabled, disabledPlaceholder, placeholder) : 
          <Text
            className={`text-xl font-generalsans-medium
            ${isDisabled ? "text-highlight-60" : "text-highlight-90"} ${
              value ? "text-lg" : "text-xl"
            }`}
          >
            {value ? value : isDisabled ? disabledPlaceholder : placeholder}
          </Text>
        }
      
        <Image
          source={icons.dropdown}
          className={`h-8 w-8 ${isOpen ? "rotate-180" : "rotate-0"} ${
            isDisabled ? "opacity-40" : "opacity-100"
          }`}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }, [options, isOpen, value])

  // Main Dropdown content
  const DropdownContent = () => {

    return (
      <SafeAreaView className="absolute z-10 w-full top-full h-[300%] shadow-lg shadow-black/60">
        <ScrollView
          nestedScrollEnabled={true}
          className={`max-h-[${maxHeight}px] h-full p-2 rounded-xl bg-background-90 z-10`}
        >
          <View className=" gap-2">
            {
            renderItem
            ? renderItem({
              name: placeholder,
              
              id: null,
            }, onChange)
            : defaultRenderItem({
              name: placeholder,
              value: null,
              
            }, onChange)
            }
            {options.map((item) =>
              renderItem
                ? renderItem(item, onChange)
                : defaultRenderItem(item, onChange)
            )}

            {isCustom && <CustomOptions />}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  // Add custom options for dropdown menu
  const CustomOptions = () => {
    return (
      <View>
        {defaultAddItem()}

        <SingleInputModal
          isVisible={modalOpen}
          handleModalOpen={handleModalOpen}
          header="Create new option"
          placeholder="Enter name"
          submitButtonText="Create"
          handleSubmit={handleCreateNew}
        />
      </View>
    );
  };

  return (
    <View className="relative flex-1">
      <DropdownButton isDisabled={!options || options.length < 1} />
      {isOpen && <DropdownContent />}
    </View>
  );
};

export default memo(DropdownMenu);
