import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ProductCollection } from "../db/ProductCollection.js";
import { ReactiveDict } from "meteor/reactive-dict";
import "./App.html";

const HIDE_COMPLETED_STRING = "hideCompleted";
const IS_LOADING_STRING = "isLoading";
const userCart = new ReactiveVar([]);

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();

  Tracker.autorun(() => {
    Meteor.subscribe("products");
  });
});

Template.mainContainer.events({
  "click .addToCart"(event) {
    event.preventDefault();
    Meteor.call("product.addToCart", { id: this._id });
    const userCartData = userCart.get();
    let exists = false;
    for (let i = 0; i < userCartData.length; i++) {
      if (userCartData[i]._id === this._id) {
        userCartData[i].quantity++;
        userCartData[i].productName = ProductCollection.find({
          _id: userCartData[i]._id,
        }).fetch()[0].productName;
        exists = true;
        break;
      }
    }
    if (!exists) {
      userCartData.push({
        _id: this._id,
        quantity: 1,
        productName: ProductCollection.find({ _id: this._id }).fetch()[0]
          .productName,
      });
    }
    userCart.set(userCartData);
  },
});
Template.cart.events({
  "click .buyNow"(event) {
    event.preventDefault();
    userCart.set([]);
  },
});

Template.mainContainer.helpers({
  getProducts(param) {
    return ProductCollection.find({ param }).fetch();
  },

  isDisabled() {
    if (this.productStock < 1) {
      return true;
    }
    return false;
  },
});

Template.cart.helpers({
  getUserCart() {
    return userCart.get();
  },
  getUserCartLength() {
    const userCartData = userCart.get();
    if (userCartData.length > 0) {
      return true;
    } else {
      return false;
    }
  },
});

Template.form.events({
  "click .addProduct"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    const productName = document.getElementsByClassName("productName")[0];
    const productStock = document.getElementsByClassName("productStock")[0];
    if (productName.value === "" || productStock.value === "") {
      alert("Product name and Stock can not be empty.");
      return;
    } else {
      Meteor.call("product.insert", {
        productName: productName.value,
        productStock: productStock.value,
      });
      productName.value = "";
      productStock.value = "";
    }
  },
});
