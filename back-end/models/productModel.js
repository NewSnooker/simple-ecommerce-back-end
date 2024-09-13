const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, default: 1, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    description: { type: String },
    image: { type: String, default: "nopic.png" },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

const Product = mongoose.model("products", schema);
module.exports = Product;
