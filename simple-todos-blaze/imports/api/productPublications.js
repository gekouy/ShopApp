import { Meteor } from "meteor/meteor";
import { ProductCollection } from "/imports/db/ProductCollection";

Meteor.publish("products", function publishProducts() {
  return ProductCollection.find({});
});
