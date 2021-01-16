const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("./product");
const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, "Farm must have a name!"],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email required"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});
//MIDDLEWARE TO DELETE A FRAM WITH ALL ITS PRODUCTS
farmSchema.post("findOneAndDelete", async function (farm) {
  if (farm.products.length) {
    const del = await Product.deleteMany({ _id: { $in: farm.products } });
    console.log(del)
  }
});
const Farm = mongoose.model("Farm", farmSchema);
module.exports = Farm;
