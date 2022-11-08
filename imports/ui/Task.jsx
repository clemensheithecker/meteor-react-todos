import React from "react";

export const Task = ({ task, onCheckboxClick }) => {
  return (
    <li>
      <input
        type="checkbox"
        // Force checked prop to a boolean
        checked={!!task.isChecked}
        onClick={() => onCheckboxClick(task)}
        // Adding the readOnly attribute since we are not using onChange to
        // update the state
        readOnly
      />
      <span>{task.text}</span>
    </li>
  );
};
