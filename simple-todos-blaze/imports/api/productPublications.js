import { Meteor } from "meteor/meteor";
import { ProductCollection } from "/imports/db/ProductCollection";

Meteor.publish("products", function publishProducts() {
  console.log("publication starting");
  return ProductCollection.find({});
});
