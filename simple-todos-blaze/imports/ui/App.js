import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TasksCollection } from '../db/TasksCollection.js';
import { ProductCollection } from '../db/ProductCollection.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './App.html';
import './Task.js';
import "./Login.js";

const HIDE_COMPLETED_STRING = 'hideCompleted';
const IS_LOADING_STRING = "isLoading";
const userCart = new ReactiveVar([]);
let pName = '';
let pStock = '';

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

const getTasksFilter = () => {
    const user = getUser();
  
    const hideCompletedFilter = { isChecked: { $ne: true } };
  
    const userFilter = user ? { userId: user._id } : {};
  
    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };
  
    return { userFilter, pendingOnlyFilter };
  };

  Template.mainContainer.onCreated(function mainContainerOnCreated() {
    this.state = new ReactiveDict();
  
    const handler = Meteor.subscribe('tasks');
    Tracker.autorun(() => {
      Meteor.subscribe('products');
      this.state.set(IS_LOADING_STRING, !handler.ready());
    });
  });

Template.mainContainer.events({
  'click #hide-completed-button'(event, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  },
  'click .logout'() {
    Meteor.logout();
  },
  'click .addToCart'(event) {
    event.preventDefault();
    Meteor.call('product.addToCart', {'id':this._id});
    const userCartData = userCart.get();
    let exists = false;
    for(let i = 0; i < userCartData.length; i++){
      console.log('id dentro del cart', userCartData[i]);
      if(userCartData[i]._id === this._id){
        userCartData[i].quantity++;
        ////////////SIMPLIFICAR/////////
        userCartData[i].productName = ProductCollection.find({_id:userCartData[i]._id}).fetch()[0].productName;
        exists = true;
        break;
      }
    }
    if(!exists){
      userCartData.push({_id: this._id, quantity: 1, productName: ProductCollection.find({_id:this._id}).fetch()[0].productName});
    }
    userCart.set(userCartData);
  }
});
Template.cart.events({
  'click .buyNow'(event) {
    console.log('buy now clicked')
    event.preventDefault();
    userCart.set([]);
  }
})

Template.mainContainer.helpers({
  tasks() {
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    if (!isUserLogged()) {
      return [];
    }

    return TasksCollection.find(
        hideCompleted ? pendingOnlyFilter : userFilter,
        {
            sort: { createdAt: -1 },
        }
        ).fetch();
  },
  
   getProducts(param) {
    console.log('products display', ProductCollection.find({param}).fetch());
    return ProductCollection.find({param}).fetch();
  },
  
  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },

  incompleteCount() {
    if (!isUserLogged()) {
      return '';
    }

    const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },

  isUserLogged() {
    return isUserLogged();
  },

  getUser() {
    return getUser();
  },
  isLoading() {
    const instance = Template.instance();
    return instance.state.get(IS_LOADING_STRING);
  },

  isDisabled(){
    if(this.productStock < 1){
      return true;
    }
    return false;
  }
});

Template.cart.helpers({
  getUserCart() {
    console.log(userCart.get())
    return userCart.get();
  },
})



Template.form.events({
  "submit .task-form"(event) {
      console.log("Product App.js Insert", event.target);
      // Prevent default browser form submit
      event.preventDefault();
  
      // Get value from form element
      const target = event.target;
      const text = target.text.value;
  
      // Insert a task into the collection
      Meteor.call('tasks.insert', text);
  
      // Clear form
      target.text.value = '';
    },
    'click .addProduct'(event) {
      
      // Prevent default browser form submit
      event.preventDefault();

      const productName = document.getElementsByClassName("productName")[0];
      console.log("productName add", productName.value);
      const productStock = document.getElementsByClassName("productStock")[0]; 
      console.log("productStock add", productStock.value);
      if(productName.value === '' || productStock.value === ''){
        alert('Product name and Stock can not be empty.');
        return;
      }
      else{ 
        Meteor.call('product.insert', {'productName':productName.value, 'productStock':productStock.value});
      }
    },
    'input .productName'(event){
      event.preventDefault();
     let name = document.getElementsByClassName("productName")[0].value;
      if( name != ''){
        pName = name;
      }
    },

    'input .productStock'(event){
      event.preventDefault();
     let stock = document.getElementsByClassName("productStock")[0].value;
      if( stock != ''){
        pStock = stock;
      };
    },

   
  });