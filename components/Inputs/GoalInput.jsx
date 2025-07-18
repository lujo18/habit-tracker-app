import React, { memo, useState, useCallback } from "react";
import BuildInput from "../BuildInput";

const GoalInput = memo(({ onGoalChange, habitGoal }) => {

  const [localGoal, setLocalGoal] = useState(habitGoal);

  const handleChange = useCallback(
    (value) => {
      setLocalGoal(value);
      onGoalChange(value);
    },
    [onGoalChange]
  );

  return (
    <BuildInput
      value={localGoal}
      handleChange={handleChange}
      placeholder="#"
      keyboardType="numeric"
      inputStyles={"w-[100px] rounded-2xl text-2xl text-center"}
    />
  );
});

export default GoalInput