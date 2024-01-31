import { Meteor } from "meteor/meteor";
import { ProductCollection } from "../db/ProductCollection";

Meteor.methods({
  "product.insert"(data) {
    if (data.productName.length > 0 && data.productStock > 0)
      ProductCollection.insert({
        productName: data.productName,
        productStock: data.productStock,
      });
  },
  "product.addToCart"(data) {
    const product = ProductCollection.findOne(data.id);
    const newStock = product.productStock - 1;
    ProductCollection.update(data.id, { $set: { productStock: newStock } });
  },
});
