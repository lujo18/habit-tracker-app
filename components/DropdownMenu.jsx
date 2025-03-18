import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { memo, useEffect, useState } from "react";
import icons from "../constants/icons";
import SingleInputModal from "./SingleInputModal";

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
  customAddOption,
  placeholder = 'Select an option',
  disabledPlaceholder = 'No options available',
  maxHeight = 200
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
      className="p-3 bg-background-70 items-center rounded-xl flex-row gap-2 top-0"
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

      
      <View className="gap-1">
        <Text className="text-highlight-90 text-xl">{item.name}</Text>

        {item.desc && <Text className="text-highlight-60">{item.desc}</Text>}
      </View>
    </TouchableOpacity>
  );

  // Custom "add item" option for dropdown menu
  const defaultAddItem = () => (
    <TouchableOpacity
      key={"custom"}
      className="mb-2 p-3 bg-habitColors-hBlue items-center justify-center rounded-xl flex-row gap-2 top-0"
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
          style={{ tintColor: "#fff" }}
        />
      </View>
      <View className="gap-1">
        <Text className="text-highlight-90 text-xl">Add Option</Text>
      </View>
    </TouchableOpacity>
  );
  

  // Dropdown button component (toggles dropdown)
  const DropdownButton = ({isDisabled}) => {
    return (
      <TouchableOpacity
        className={`flex-row p-4 items-center justify-between rounded-xl relative ${
          isDisabled 
            ? "bg-background-80 opacity-80"
            : "bg-background-80"
        }`}
        onPress={isDisabled ? null : toggleDropdown}
      >
        <Text className={`text-xl 
          ${
            isDisabled 
              ? "text-highlight-60"
              : "text-highlight-90"
          } ${value ? "text-lg" : "text-xl"
        }`}>
          {value ? value : isDisabled ? disabledPlaceholder : placeholder}
        </Text>
        <Image
          source={icons.dropdown}
          className={`h-8 w-8 ${isOpen ? "rotate-180" : "rotate-0"} ${
            isDisabled 
              ? "opacity-40"
              : "opacity-100"
          }`}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }

  
  // Main Dropdown content
  const DropdownContent = () => {
    return (
      <ScrollView
        nestedScrollEnabled={true}
        className={`max-h-[${maxHeight}px] p-2 rounded-xl bg-background-80 absolute z-10 w-full top-full`}
      >
        <View className=" gap-2">
          {options.map((item) => (
              renderItem ? renderItem(item, onChange) : defaultRenderItem(item, onChange)
          ))}

          {isCustom && (
            <CustomOptions />
          )}
        </View>
      </ScrollView>
    )
  }

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
    )
  }

  return (
    <View className="relative flex-1">
      <DropdownButton isDisabled={options.length < 1}/>
      {isOpen && (
        <DropdownContent />
      )}
    </View>
  );
};

export default memo(DropdownMenu);
