const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const { saveImageToGoogle } = require("../lib/saveImageToGoogle");

exports.showAll = async (req, res, next) => {
  try {
    const user = await User.find().sort({ createdAt: -1 });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดบางอย่าง" + error,
    });
  }
};
exports.showById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      const err = new Error("ไม่พบผู้ใช้งาน");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดบางอย่าง" + error,
    });
  }
};
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existEmail = await User.findOne({ email });

    if (existEmail) {
      const err = new Error("อีเมลนี้มีผู้ใช้งานแล้ว");
      err.statusCode = 400;
      throw err;
    }

    let imageUrl = null;

    if (req.file) {
      const fileName = await saveImageToGoogle(req.file);
      imageUrl = `https://storage.googleapis.com/${config.BUCKET}/${fileName}`;
    }

    const user = new User({
      username,
      email,
      image: imageUrl,
    });

    user.password = await user.encryptPassword(password);
    await user.save();

    res.status(200).json({
      message: "สมัครสมาชิกสําเร็จ",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดบางอย่าง" + error,
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    // console.log(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("ไม่พบผู้ใช้งาน");
      err.statusCode = 404;
      throw err;
    }
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const err = new Error("รหัสผ่านไม่ถูกต้อง");
      err.statusCode = 401;
      throw err;
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
      config.JWT_SECRET,
      { expiresIn: "3days" }
    );
    const expire_in = jwt.decode(token);
    res.status(200).json({
      message: "เข้าสู่ระบบสําเร็จ",
      access_token: token,
      expire_in: expire_in.exp,
      token_type: "Bearer",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดบางอย่าง" + error,
    });
  }
};
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, role, password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      const err = new Error("ไม่พบผู้ใช้งาน");
      err.statusCode = 404;
      throw err;
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) {
      user.password = await user.encryptPassword(password);
    }
    if (req.file) {
      const fileName = await saveImageToGoogle(req.file);
      user.image = `https://storage.googleapis.com/${config.BUCKET}/${fileName}`;
    }
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).json(userResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดบางอย่าง" + error,
    });
  }
};
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      const err = new Error("ไม่พบผู้ใช้งานที่ต้องการลบ");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      message: "ลบผู้ใช้งานสําเร็จ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดบางอย่าง" + error,
    });
  }
};
exports.getPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1); //หน้าที่ต้องการ
    const limit = parseInt(req.query.limit || 10); //จํานวนข้อมูลต่อหน้า
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limit); //หาจํานวนหน้าทั้งหมด

    res.status(200).json({
      users,
      currentPage: page,
      totalPages,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดบางอย่าง" + error,
    });
  }
};
