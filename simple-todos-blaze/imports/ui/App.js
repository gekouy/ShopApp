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
      console.log("id dentro del cart", userCartData[i]);
      if (userCartData[i]._id === this._id) {
        userCartData[i].quantity++;
        ////////////SIMPLIFICAR/////////
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
    console.log("buy now clicked");
    event.preventDefault();
    userCart.set([]);
  },
});

Template.mainContainer.helpers({
  getProducts(param) {
    console.log("products display", ProductCollection.find({ param }).fetch());
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
    console.log(userCart.get());
    return userCart.get();
  },
});

Template.form.events({
  "click .addProduct"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    const productName = document.getElementsByClassName("productName")[0];
    console.log("productName add", productName.value);
    const productStock = document.getElementsByClassName("productStock")[0];
    console.log("productStock add", productStock.value);
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
  "input .productName"(event) {
    event.preventDefault();
    let name = document.getElementsByClassName("productName")[0].value;
    if (name != "") {
      pName = name;
    }
  },
  "input .productStock"(event) {
    console.log("se esta escribiendo");
    event.preventDefault();
    let stock = document.getElementsByClassName("productStock")[0].value;

    if (stock.match(/^\d{1,7}/)) {
      stock = stock;
    }
  },
});
