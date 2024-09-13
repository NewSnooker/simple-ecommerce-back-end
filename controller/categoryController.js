const { default: mongoose } = require("mongoose");
const Category = require("../models/categoryModel");

exports.showAll = async (req, res, next) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products", // ชื่อคอลเล็กชันที่คุณต้องการ join
          localField: "_id", // ฟิลด์ใน Category ที่จะใช้ join
          foreignField: "category", // ฟิลด์ใน Product ที่จะใช้ join
          as: "products", // ชื่อฟิลด์ที่จะแสดงผลลัพธ์ของ join
        },
      },
      {
        $sort: { createdAt: -1 }, // การเรียงลำดับ
      },
    ]);
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};

exports.showById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "products", // ชื่อคอลเล็กชันที่ต้องการรวมข้อมูล
          localField: "_id", // ฟิลด์ที่ใช้จับคู่
          foreignField: "category", // ฟิลด์ในคอลเล็กชันที่ต้องการรวมข้อมูล
          as: "products", // ชื่อฟิลด์ที่ต้องการให้ข้อมูลรวมมาอยู่ในนั้น
        },
      },
      { $sort: { createdAt: -1 } }, // ตัวเลือกเพิ่มเติม เช่น การเรียงลำดับ
    ]);

    if (!category || category.length === 0) {
      const err = new Error("ไม่พบหมวดหมู่");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json(category[0]); // เพราะ `aggregate` คืนค่ามาเป็น array
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // ตรวจสอบว่าหมวดหมู่ที่มีชื่อเดียวกันมีอยู่แล้วหรือไม่
    const exist = await Category.findOne({ name });
    if (exist) {
      const err = new Error("ชื่อหมวดหมู่นี้มีอยู่แล้ว");
      err.statusCode = 400;
      throw err;
    }

    // สร้างหมวดหมู่ใหม่
    const category = new Category({
      name,
      description,
    });

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findById(id);

    if (!category) {
      const err = new Error("ไม่พบหมวดหมู่");
      err.statusCode = 404;
      throw err;
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามีสินค้าที่ใช้หมวดหมู่นี้อยู่หรือไม่
    const productExists = await Product.findOne({ category: id });
    if (productExists) {
      const err = new Error(
        "ไม่สามารถลบหมวดหมู่ได้ เนื่องจากยังมีสินค้าที่ใช้หมวดหมู่นี้อยู่"
      );
      err.statusCode = 400;
      throw err;
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      const err = new Error("ไม่พบหมวดหมู่ที่ต้องการลบ");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      message: "ลบหมวดหมู่สำเร็จ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};

exports.getPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1); // หน้าที่ต้องการ
    const limit = parseInt(req.query.limit || 10); // จํานวนข้อมูลต่อหน้า
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Category.countDocuments();
    const totalPages = Math.ceil(total / limit); // หาจํานวนหน้าทั้งหมด

    res.status(200).json({
      categories,
      currentPage: page,
      totalPages,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: " + error.message,
    });
  }
};
