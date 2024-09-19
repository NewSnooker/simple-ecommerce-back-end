const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // ตรวจสอบว่าสินค้ามีอยู่จริง
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    // ค้นหาตะกร้าของผู้ใช้ หรือสร้างใหม่ถ้ายังไม่มี
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // ตรวจสอบว่าสินค้านี้มีในตะกร้าแล้วหรือไม่
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      // ถ้ามีแล้ว ให้เพิ่มจำนวน
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // ถ้ายังไม่มี ให้เพิ่มสินค้าใหม่
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};

exports.increaseQuantity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
      userId,
    });
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) {
      // ถ้ายังไม่มี ให้เพิ่มสินค้าใหม่
      cart.products.push({ productId, quantity });
    } else {
      // ถ้ามีแล้ว ให้เพิ่มจำนวน
      cart.products[productIndex].quantity += quantity;
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};

exports.decreaseQuantity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
      userId,
    });
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "ไม่พบสินค้าในตะกร้า" });
    }

    if (cart.products[productIndex].quantity <= quantity) {
      // ถ้าจำนวนที่ต้องการลดมากกว่าหรือเท่ากับจำนวนที่มีอยู่ ให้ลบสินค้าออกจากตะกร้า
      cart.products.splice(productIndex, 1);
    } else {
      cart.products[productIndex].quantity -= quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({
      userId,
    });
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "ไม่พบสินค้าในตะกร้า" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "ไม่พบ ID ผู้ใช้" });
    }

    const cart = await Cart.findOne({
      userId,
    }).populate("products.productId");
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตะกร้าสินค้า" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};
