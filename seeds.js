const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost/farmsStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Open in MONGO!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO ERROR!!!");
    console.log(err);
  });

// const p = new Product({ name: "Grapes", price: 15, category: "fruit" });
// p.save()
//   .then(() => {
//     console.log("DATABASE WORKING");
//     console.log(p);
//   })
//   .catch((err) => {
//     console.log("OH NOO AN ERROR!");
//     console.log(err);
//   });

const seedProduct = [
  { name: "Dragonfruit", price: 12.34, category: "fruit" },
  { name: "Milk", price: 2.33, category: "dairy" },
  { name: "Bringle", price: 54, category: "vegetable" },
  { name: "Pomogranate", price: 3.61, category: "fruit" },
  { name: "organic goddess melon", price: 7.12, category: "fruit" },
];

Product.insertMany(seedProduct)
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });
