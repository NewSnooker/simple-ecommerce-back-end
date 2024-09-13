var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");
const upload = require("../middleware/multerConfig");
const passport = require("../middleware/passpostJWT");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: ดึงข้อมูลผู้ใช้ทั้งหมด
 *     description: ดึงข้อมูลผู้ใช้ทั้งหมด โดยต้องเข้าสู่ระบบและมีสิทธิ์เป็น Admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: รายชื่อผู้ใช้ทั้งหมด
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       403:
 *         description: คุณไม่มีสิทธิ์เข้าถึงในส่วนนี้ (ต้องเป็น Admin)
 */
router.get("/", [passport.isLogin, passport.isAdmin], userController.showAll);

/**
 * @swagger
 * /users/pagination:
 *   get:
 *     summary: ดึงข้อมูลผู้ใช้พร้อมระบบแบ่งหน้า
 *     description: ดึงข้อมูลผู้ใช้พร้อมระบบแบ่งหน้า โดยต้องเข้าสู่ระบบและมีสิทธิ์เป็น Admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: หน้าที่ต้องการ (ค่าที่เป็นตัวเลข)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: จำนวนข้อมูลต่อหน้า (ค่าที่เป็นตัวเลข)
 *     responses:
 *       200:
 *         description: รายชื่อผู้ใช้พร้อมข้อมูลการแบ่งหน้า
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       403:
 *         description: คุณไม่มีสิทธิ์เข้าถึงในส่วนนี้ (ต้องเป็น Admin)
 */
router.get(
  "/pagination",
  [passport.isLogin, passport.isAdmin],
  userController.getPagination
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: ดึงข้อมูลผู้ใช้ตาม ID
 *     description: ดึงข้อมูลผู้ใช้ตาม ID โดยยังไม่เข้าสู่ระบบ
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสผู้ใช้ (User ID)
 *     responses:
 *       200:
 *         description: ข้อมูลผู้ใช้
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       403:
 *         description: คุณไม่มีสิทธิ์เข้าถึงในส่วนนี้ (ต้องเป็น Admin)
 *       404:
 *         description: ไม่พบผู้ใช้งาน
 */
router.get("/:id", [passport.isLogin], userController.showById);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: สมัครสมาชิกใหม่
 *     description: สมัครสมาชิกใหม่พร้อมอัปโหลดรูปโปรไฟล์
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: สมัครสมาชิกสำเร็จ
 *       400:
 *         description: อีเมลนี้มีผู้ใช้งานแล้ว
 */
router.post("/register", upload.single("image"), userController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: เข้าสู่ระบบ
 *     description: เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: เข้าสู่ระบบสำเร็จ
 *       401:
 *         description: รหัสผ่านไม่ถูกต้อง
 *       404:
 *         description: ไม่พบผู้ใช้งาน
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลผู้ใช้ตาม ID
 *     description: แก้ไขข้อมูลผู้ใช้ตาม ID โดยต้องเข้าสู่ระบบ
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสผู้ใช้ (User ID)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: ข้อมูลการแก้ไข
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 */
router.put(
  "/:id",
  upload.single("image"),
  [passport.isLogin],
  userController.update
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: ลบผู้ใช้ตาม ID
 *     description: ลบผู้ใช้ตาม ID โดยต้องมีสิทธิ์เป็น Admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสผู้ใช้ (User ID)
 *     responses:
 *       200:
 *         description: ลบผู้ใช้งานสําเร็จ
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       403:
 *         description: คุณไม่มีสิทธิ์เข้าถึงในส่วนนี้ (ต้องเป็น Admin)
 *       404:
 *         description: ไม่พบผู้ใช้งาน
 */
router.delete(
  "/:id",
  [passport.isLogin, passport.isAdmin],
  userController.delete
);

module.exports = router;
