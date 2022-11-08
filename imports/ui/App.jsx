import React from "react";
import { Hello } from "./Hello.jsx";
import { Info } from "./Info.jsx";
import { Task } from "./Task.jsx";

// The underscore identifier _ is used to preface names of object properties that are private.
const tasks = [
  { _id: 1, text: "Clean the house" },
  { _id: 2, text: "Buy groceries" },
  { _id: 3, text: "Walk the dog" },
];

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <section>
      <h2>To-Dos</h2>
      <ul>
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </ul>
    </section>

    <Hello />
    <Info />
  </div>
);
