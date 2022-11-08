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

const convertTime = (time) => {
  return new Date(time).toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const App = () => {
  const tasks = useTracker(() =>
    // Show newest tasks first
    TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch()
  );

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>To-Dos</h1>
            <p>{convertTime(new Date())}</p>
          </div>
        </div>
      </header>
      <main className="main">
        <TaskForm />

        <ul className="tasks">
          {tasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              onCheckboxClick={toggleChecked}
              onDeleteClick={deleteTask}
            />
          ))}
        </ul>
      </main>
    </div>
  );
};
