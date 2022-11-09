import { Meteor } from "meteor/meteor";
import React, { useState, Fragment } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Task } from "./Task";
import { TasksCollection } from "/imports/api/TasksCollection";
import { TaskForm } from "./TaskForm";
import { LoginForm } from "./LoginForm";

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
  const user = useTracker(() => Meteor.user());

  // hideCompleted = value of state; sethideCompleted = setter function to
  // update the state
  const [hideCompleted, setHideCompleted] = useState(false);

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const tasks = useTracker(() =>
    // If hideCompleted === True, only show tasks with
    // isChecked property !== true
    TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      // Show newest tasks first
      sort: { createdAt: -1 },
    }).fetch()
  );

  // Count the number of uncompleted tasks
  const pendingTasksCount = useTracker(() =>
    TasksCollection.find(hideCompletedFilter).count()
  );

  // If pendingsTasksCount is not zero, set the pendingTasksTitle to the
  // pendingTasksCount; otherwise set it to an empty string
  const pendingTasksTitle = `${
    pendingTasksCount ? `(${pendingTasksCount})` : ""
  }`;

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            {user ? (
              <Fragment>
                <h1>To-Dos {pendingTasksTitle}</h1>
                <p>{convertTime(new Date())}</p>
              </Fragment>
            ) : (
              <h1>Log In</h1>
            )}
          </div>
        </div>
      </header>
      <main className="main">
        {user ? (
          <Fragment>
            <TaskForm />

            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? "Show All" : "Hide Completed"}
              </button>
            </div>

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
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </main>
    </div>
  );
};
