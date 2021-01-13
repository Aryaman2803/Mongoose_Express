const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const methodOverride = require("method-override");

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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//THESE ARE MIDDLEWARES

//(5.1)Telling express to use the middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruit", "vegetable", "dairy"];

/*(1) We Query our product model

(1.1) {} These empty Object parenthesis: So find everything, match every product.

(1.2) Now querying takes some time as it returns a promise thing. 
We could to that .then() and catch() 
but instead we will do the async and await*/

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  //(2) Create the render path
  //(2.1) Check if its working first , we should already have index.ejs in views->products folder
  //(2.2) Now pass all the products as second argument, so we have access to all products in index.ejs
  res.render("products/index", { products });
});

//(4) Create Form GET (Entry) Route
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

//(5) That new Form submission is routed here
//(5.1) WE TELL EXPRESS TO USE THAT MIDDLEWARE  (WRITTEN ON TOP)
app.post("/products", async (req, res) => {
  // console.log(req.body);
  //(5.2) Process to add newly entered product in Database
  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.redirect("/products");
});

//(3)Get product details route
app.get("/products/:id", async (req, res) => {
  //(3.1) We grab/find an ID in req.params
  const { id } = req.params;
  //(3.2) Find the ID in Products Model and make it await for mongoose operation
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

//(6) Route For Edit Form
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});

//(7) We are updating form so we use PUT/PATCH any is fine
/*(7.1) NOW the problem is that we can't actually make a put request,
  So our edit form will have POST method and then we use METHOD OVERRIDE,
  Install  it first - npm i method-override
  then ADD app.use(methodOverride('_method'))..at top,
  then in edit form action add the '?_method=PUT'
 
*/

app.put("/products/:id/", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  console.log(req.body);
  res.redirect(`/products/${product._id}`);
});

//(8)Make an DELETE Request. we can't actually do that in HTML Form in the browser but we can fake it
// We can send a POST request then add on the method override query string
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);
  res.redirect('/products')
});

app.listen(port, () => {
  console.log("CONNECTED PORT: " + port);
});
