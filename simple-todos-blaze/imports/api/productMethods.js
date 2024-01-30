import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ProductCollection } from '../db/ProductCollection';

Meteor.methods({
  'product.insert'(data) {
    console.log("Product insert", data);
    //check(text, String);
 
    ProductCollection.insert({
      'productName': data.productName,
      'productStock': data.productStock,
    })
  },
  'product.addToCart'(data) {
    console.log("Product add to cart", data.id);
    const product = ProductCollection.findOne(data.id);
    const newStock = product.productStock - 1;
    console.log(newStock);
    ProductCollection.update(data.id, {$set: {'productStock': newStock}
    });
  },
});