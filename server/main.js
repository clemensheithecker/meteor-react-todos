import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { ServiceConfiguration } from "meteor/service-configuration";

import "/imports/api/tasksMethods";
import "/imports/api/tasksPublications";
import { TasksCollection } from "/imports/db/TasksCollection";

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = "meteorite";
const SEED_PASSWORD = "password";

Meteor.startup(
  () => {
    // If a user with SEED_USERNAME does not exit create one
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
      Accounts.createUser({
        username: SEED_USERNAME,
        password: SEED_PASSWORD,
      });
    }

    const user = Accounts.findUserByUsername(SEED_USERNAME);

    // If the Tasks collection is empty, add some data.
    if (TasksCollection.find().count() === 0) {
      [
        "Clean the house",
        "Buy groceries",
        "Walk the dog",
        "Wash the car",
        "Water the plants",
        "Write some code",
        "Fix the bathroom lights",
      ].forEach((taskText) => insertTask(taskText, user));
    }
  },

  ServiceConfiguration.configurations.upsert(
    { service: "github" },
    {
      $set: {
        loginStyle: "popup",
        clientId: process.env.GITHUB_CLIENT_ID,
        secret: process.env.GITHUB_SECRET,
      },
    }
  )
);
