const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true }, // ชื่อหมวดหมู่ ห้ามซ้ำ
    description: { type: String }, // คำอธิบายหมวดหมู่
  },
  {
    collection: "categories",
    timestamps: true,
  }
);

const Category = mongoose.model("categories", categorySchema);
module.exports = Category;
