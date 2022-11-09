import { Meteor } from "meteor/meteor";
import { TasksCollection } from "/imports/db/TasksCollection";

// Publish all tasks from the authenticated user
Meteor.publish("tasks", function publishTasks() {
  return TasksCollection.find({ userId: this.userId });
});
