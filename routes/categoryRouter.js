var express = require("express");
var router = express.Router();
const categoryController = require("../controller/categoryController");
const upload = require("../middleware/multerConfig");
const passport = require("../middleware/passpostJWT");

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: การจัดการหมวดหมู่
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: ดึงข้อมูลหมวดหมู่ทั้งหมด
 *     description: ดึงข้อมูลหมวดหมู่ทั้งหมด โดยยังไม่เข้าสู่ระบบ
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: รายการหมวดหมู่ทั้งหมด
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   products:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Product'
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get("/", categoryController.showAll);

/**
 * @swagger
 * /categories/pagination:
 *   get:
 *     summary: ดึงข้อมูลหมวดหมู่พร้อมการแบ่งหน้า
 *     description: ดึงข้อมูลหมวดหมู่พร้อมการแบ่งหน้า โดยยังไม่เข้าสู่ระบบ
 *     tags: [Category]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: หน้าที่ต้องการ (ค่าที่เป็นตัวเลข)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: จำนวนข้อมูลต่อหน้า (ค่าที่เป็นตัวเลข)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: รายการหมวดหมู่แบบแบ่งหน้า
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 100
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get("/pagination", categoryController.getPagination);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: ดึงข้อมูลหมวดหมู่ตาม ID
 *     description: ดึงข้อมูลหมวดหมู่ตาม ID โดยไม่ต้องเข้าสู่ระบบ
 *     tags: [Category]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID ของหมวดหมู่ที่ต้องการดึงข้อมูล
 *         required: true
 *         schema:
 *           type: string
 *           example: "60b7dce3f9d8f761d4a0e2c0"
 *     responses:
 *       200:
 *         description: ข้อมูลของหมวดหมู่ ตาม ID
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   products:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: ไม่พบหมวดหมู่
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get("/:id", categoryController.showById);

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: สร้างหมวดหมู่ใหม่
 *     tags: [Category]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: ชื่อของหมวดหมู่
 *                 example: "อิเล็กทรอนิกส์"
 *               description:
 *                 type: string
 *                 description: คำอธิบายของหมวดหมู่
 *                 example: "หมวดหมู่สำหรับสินค้าประเภทอิเล็กทรอนิกส์"
 *     responses:
 *       200:
 *         description: หมวดหมู่ถูกสร้างสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: ชื่อหมวดหมู่นี้มีอยู่แล้ว
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.post(
  "/create",
  [passport.isLogin, passport.isAdmin],
  categoryController.create
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: อัปเดตหมวดหมู่ตาม ID
 *     tags: [Category]
 *     description: แก้ไขข้อมูลหมวดหมู่ตาม ID โดยต้องเข้าสู่ระบบและมีสิทธิ์เป็น Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: รหัสของหมวดหมู่ (Category ID)
 *         required: true
 *         schema:
 *           type: string
 *           example: "id"
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: ชื่อใหม่ของหมวดหมู่
 *                 example: "อิเล็กทรอนิกส์อัปเดต"
 *               description:
 *                 type: string
 *                 description: คำอธิบายใหม่ของหมวดหมู่
 *                 example: "คำอธิบายหมวดหมู่ที่อัปเดต"
 *     responses:
 *       200:
 *         description: อัปเดตหมวดหมู่สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: ไม่พบหมวดหมู่
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.put(
  "/:id",
  [passport.isLogin, passport.isAdmin],
  categoryController.update
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: ลบหมวดหมู่ตาม ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID ของหมวดหมู่ที่ต้องการลบ
 *         required: true
 *         schema:
 *           type: string
 *           example: "60b7dce3f9d8f761d4a0e2c0"
 *     responses:
 *       200:
 *         description: ลบหมวดหมู่สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ลบหมวดหมู่สำเร็จ"
 *       400:
 *         description: ไม่สามารถลบหมวดหมู่ได้ เนื่องจากยังมีสินค้าที่ใช้หมวดหมู่นี้อยู่
 *       404:
 *         description: ไม่พบหมวดหมู่ที่ต้องการลบ
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.delete(
  "/:id",
  [passport.isLogin, passport.isAdmin],
  categoryController.delete
);

module.exports = router;
