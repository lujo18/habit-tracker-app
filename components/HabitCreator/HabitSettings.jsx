import { View, Text } from 'react-native'
import React, { memo, useMemo } from 'react'
import BuildScreen from './HabitTypes/BuildScreen';
import QuitScreen from './HabitTypes/QuitScreen';
import TallyScreen from './HabitTypes/TallyScreen';
import DynamicScreen from './HabitTypes/DynamicScreen'
import BuildInput from '../BuildInput';

// Move outside HabitSettings component
const RenderHabitSettingPage = memo(({
  habitType,
  habitLimit,
  habitLabel,
  habitRepeat,
  habitGoal,
  habitLocation,
  habitMaxGoal,
  onGoalChange,
  openMenu,
  handleOpen,
  setType,
  setLabel,
  setRepeat,
  setLocation,
  setMaxGoal,
  goalOption,
  repeatOption,
  labelOption,
  locationOption,
  addHabitLabel,
  addHabitLocation,
  startTime,
  setStartTime,
}) => {
  switch (habitType) {
    case "dynamic" :
      return (
        <DynamicScreen
          habitLimit={habitLimit}
          habitLabel={habitLabel}
          habitRepeat={habitRepeat}
          habitGoal={habitGoal}
          habitLocation={habitLocation}
          habitMaxGoal={habitMaxGoal}
          onGoalChange={onGoalChange}
          openMenu={openMenu}
          handleOpen={handleOpen}
          setType={setType}
          setLabel={setLabel}
          setRepeat={setRepeat}
          setLocation={setLocation}
          setMaxGoal={setMaxGoal}
          goalOption={goalOption}
          repeatOption={repeatOption}
          labelOption={labelOption}
          locationOption={locationOption}
          addHabitLabel={addHabitLabel}
          addHabitLocation={addHabitLocation}
        />
      );
    case "build":
      return (
        <BuildScreen
          habitLimit={habitLimit}
          habitLabel={habitLabel}
          habitRepeat={habitRepeat}
          habitGoal={habitGoal}
          habitLocation={habitLocation}
          onGoalChange={onGoalChange}
          openMenu={openMenu}
          handleOpen={handleOpen}
          setType={setType}
          setLabel={setLabel}
          setRepeat={setRepeat}
          setLocation={setLocation}
          goalOption={goalOption}
          repeatOption={repeatOption}
          labelOption={labelOption}
          locationOption={locationOption}
          addHabitLabel={addHabitLabel}
          addHabitLocation={addHabitLocation}
        />
      );
    case "quit":
      return <QuitScreen startTime={startTime} setStartTime={setStartTime} />;
    case "tally":
      return (
        <TallyScreen
          habitLabel={habitLabel}
          habitRepeat={habitRepeat}
          openMenu={openMenu}
          handleOpen={handleOpen}
          setLabel={setLabel}
          setRepeat={setRepeat}
          labelOption={labelOption}
          repeatOption={repeatOption}
        />
      );
    default:
      return <Text>Select an option</Text>;
  }
});

const HabitSettings = ({
  habitType,
  habitName,
  habitLimit,
  habitLabel,
  habitRepeat,
  habitGoal,
  habitLocation,
  habitMaxGoal,
  onGoalChange,
  openMenu,
  handleOpen,
  setName,
  setType,
  setLabel,
  setRepeat,
  setLocation,
  setMaxGoal,
  goalOption,
  repeatOption,
  labelOption,
  locationOption,
  addHabitLabel,
  addHabitLocation,
  startTime,
  setStartTime,
}) => {
  // Use useMemo to memoize props object
  const settingPageProps = useMemo(() => ({
    habitType,
    habitLimit,
    habitLabel,
    habitRepeat,
    habitGoal,
    habitLocation,
    habitMaxGoal,
    onGoalChange,
    openMenu,
    handleOpen,
    setType,
    setLabel,
    setRepeat,
    setLocation,
    setMaxGoal,
    goalOption,
    repeatOption,
    labelOption,
    locationOption,
    addHabitLabel,
    addHabitLocation,
    startTime,
    setStartTime,
  }), [
    habitType,
    habitLimit,
    habitLabel,
    habitRepeat,
    habitGoal,
    habitLocation,
    habitMaxGoal,
    onGoalChange,
    openMenu,
    handleOpen,
    setType,
    setLabel,
    setRepeat,
    setLocation,
    setMaxGoal,
    goalOption,
    repeatOption,
    labelOption,
    locationOption,
    addHabitLabel,
    addHabitLocation,
    startTime,
    setStartTime,
  ]);

  return (
    <View>
      <View className="my-6">
        <BuildInput
          value={habitName}
          handleChange={setName}
          placeholder="Your new habit"
          inputStyles="text-lg"
        />
      </View>
      <RenderHabitSettingPage {...settingPageProps} />
    </View>
  );
};

export default HabitSettings
