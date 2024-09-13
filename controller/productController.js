const Product = require("../models/productModel");
const config = require("../config/index");
const { saveImageToGoogle } = require("../lib/saveImageToGoogle");

exports.showAll = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" + error,
    });
  }
};
exports.showById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");
    if (!product) {
      const err = new Error("ไม่พบสินค้า");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" + error,
    });
  }
};
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description, quantity, categoryId } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      const err = new Error("ไม่พบสินค้า");
      err.statusCode = 404;
      throw err;
    }
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (quantity) product.quantity = parseInt(quantity);
    if (categoryId) product.category = categoryId;
    if (req.file) {
      const fileName = await saveImageToGoogle(req.file);
      product.image = `https://storage.googleapis.com/${config.BUCKET}/${fileName}`;
    }
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" + error,
    });
  }
};
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      const err = new Error("ไม่พบสินค้าที่ต้องการลบ");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "ลบสินค้าสําเร็จ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" + error,
    });
  }
};
exports.getPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1); //หน้าที่ต้องการ
    const limit = parseInt(req.query.limit || 10); //จํานวนข้อมูลต่อหน้า
    const skip = (page - 1) * limit;

    const product = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit); //หาจํานวนหน้าทั้งหมด

    res.status(200).json({
      product,
      currentPage: page,
      totalPages,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" + error,
    });
  }
};
exports.create = async (req, res, next) => {
  try {
    const { name, price, description, quantity, categoryId } = req.body;

    // ตรวจสอบว่าสินค้าที่มีชื่อเดียวกันมีอยู่แล้วหรือไม่
    const exist = await Product.findOne({ name });
    if (exist) {
      const err = new Error("ชื่อสินค้านี้มีอยู่แล้ว");
      err.statusCode = 400;
      throw err;
    }

    // สร้าง Product ใหม่
    const product = new Product({
      name,
      price: parseInt(price),
      description,
      quantity: quantity ? parseInt(quantity) : 1,
      category: categoryId, // ต้องเป็น ObjectId ของ category
    });

    if (req.file) {
      const fileName = await saveImageToGoogle(req.file);
      product.image = `https://storage.googleapis.com/${config.BUCKET}/${fileName}`;
    }
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};
