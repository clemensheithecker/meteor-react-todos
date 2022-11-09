import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

import React, { useState, Fragment } from "react";

import { LoginForm } from "./LoginForm";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import { TasksCollection } from "/imports/db/TasksCollection";

const toggleChecked = ({ _id, isChecked }) =>
  Meteor.call("tasks.setIsChecked", _id, !isChecked);

const deleteTask = ({ _id }) => Meteor.call("tasks.remove", _id);

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

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0 };

    if (!Meteor.user()) {
      return noDataAvailable;
    }

    const handler = Meteor.subscribe("tasks");

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    // If hideCompleted === True, only show tasks with
    // isChecked property !== true for the logged-in user
    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        // Show newest tasks first
        sort: { createdAt: -1 },
      }
    ).fetch();

    // Count the number of uncompleted tasks
    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });

  // If pendingsTasksCount is not zero, set the pendingTasksTitle to the
  // pendingTasksCount; otherwise set it to an empty string
  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : ""
  }`;

  const logout = () => Meteor.logout();

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            {user ? (
              <Fragment>
                <h1>To-Dos {pendingTasksTitle}</h1>
                <p>{convertTime(new Date())}</p>
                <div className="user" onClick={logout}>
                  {user.username || user.profile.name} (Log Out)
                </div>
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

            {isLoading && <div className="loading">Loading...</div>}

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
