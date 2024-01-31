import { Meteor } from "meteor/meteor";

import "/imports/api/productMethods";
import "/imports/api/productPublications";
import { ProductCollection } from "../imports/db/ProductCollection";

Meteor.startup(() => {
  const startupProducts = [
    { name: "T-Shirt", stock: 10 },
    { name: "Sweater", stock: 20 },
    { name: "Boots", stock: 45 },
    { name: "Belt", stock: 5 },
    { name: "Skirt", stock: 15 },
  ];
  if (ProductCollection.find().count() === 0) {
    startupProducts.forEach((product) =>
      Meteor.call("product.insert", {
        productName: product.name,
        productStock: product.stock,
      })
    );
  }
});
