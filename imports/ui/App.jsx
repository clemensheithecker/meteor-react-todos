import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Task } from "./Task.jsx";
import { TasksCollection } from "/imports/api/TasksCollection.js";
import { TaskForm } from "./TaskForm";

export const App = () => {
  const tasks = useTracker(() => TasksCollection.find({}).fetch());

  return (
    <section>
      <h1>To-Dos</h1>

      <TaskForm />

      <ul>
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </ul>
    </section>
  );
};
