import { Meteor } from "meteor/meteor";
import { TasksCollection } from "/imports/api/TasksCollection";

const insertTask = (taskText) => TasksCollection.insert({ text: taskText });

Meteor.startup(() => {
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
