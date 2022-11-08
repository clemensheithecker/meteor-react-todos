import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Task } from "./Task.jsx";
import { TasksCollection } from "/imports/api/TasksCollection.js";
import { TaskForm } from "./TaskForm";

const toggleChecked = ({ _id, isChecked }) => {
  TasksCollection.update(_id, {
    $set: {
      isChecked: !isChecked,
    },
  });
};

const deleteTask = ({ _id }) => TasksCollection.remove(_id);

export const App = () => {
  const tasks = useTracker(() =>
    // Show newest tasks first
    TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch()
  );

  return (
    <section>
      <h1>To-Dos</h1>

      <TaskForm />

      <ul>
        {tasks.map((task) => (
          <Task
            key={task._id}
            task={task}
            onCheckboxClick={toggleChecked}
            onDeleteClick={deleteTask}
          />
        ))}
      </ul>
    </section>
  );
};
