import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { TasksCollection } from "/imports/api/TasksCollection";

const SEED_USERNAME = "meteorite";
const SEED_PASSWORD = "password";

const insertTask = (taskText) => TasksCollection.insert({ text: taskText });

Meteor.startup(() => {
  // If a user with SEED_USERNAME does not exit create one
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

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
    ].forEach(insertTask);
  }
});
