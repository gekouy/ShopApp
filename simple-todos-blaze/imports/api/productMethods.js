import { Meteor } from "meteor/meteor";
import { ProductCollection } from "../db/ProductCollection";

Meteor.methods({
  "product.insert"(data) {
    ProductCollection.insert({
      productName: data.productName,
      productStock: data.productStock,
    });
  },
  "product.addToCart"(data) {
    console.log("Product add to cart", data.id);
    const product = ProductCollection.findOne(data.id);
    const newStock = product.productStock - 1;
    console.log(newStock);
    ProductCollection.update(data.id, { $set: { productStock: newStock } });
  },
});
