var express = require("express");
var router = express.Router();
const productController = require("../controller/productController");
const upload = require("../middleware/multerConfig");
const passport = require("../middleware/passpostJWT");
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: การจัดการสินค้าของร้านค้า
 */
/**
 * @swagger
 * /products:
 *   get:
 *     summary: ดึงข้อมูลสินค้าทั้งหมด
 *     description: ดึงข้อมูลสินค้าทั้งหมด โดยยังไม่เข้าสู่ระบบ
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: รายชื่อสินค้าทั้งหมด
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get("/", productController.showAll);

/**
 * @swagger
 * /products/pagination:
 *   get:
 *     summary: ดึงข้อมูลสินค้าพร้อมระบบแบ่งหน้า
 *     description: ดึงข้อมูลสินค้าพร้อมระบบแบ่งหน้า โดยยังไม่เข้าสู่ระบบ
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: หน้าที่ต้องการ (ค่าที่เป็นตัวเลข)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: จำนวนข้อมูลต่อหน้า (ค่าที่เป็นตัวเลข)
 *     responses:
 *       200:
 *         description: รายชื่อสินค้าพร้อมข้อมูลการแบ่งหน้า
 *         content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
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
router.get("/pagination", productController.getPagination);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: ดึงข้อมูลสินค้าตาม ID
 *     description: ดึงข้อมูลสินค้าตาม ID โดยยังไม่เข้าสู่ระบบ
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสสินค้า (Product ID)
 *     responses:
 *       200:
 *         description: ข้อมูลสินค้า ตาม ID
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: ไม่พบสินค้า
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get("/:id", productController.showById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลสินค้าตาม ID
 *     description: แก้ไขข้อมูลสินค้าตาม ID โดยต้องเข้าสู่ระบบและมีสิทธิ์เป็น Admin
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสสินค้า (Product ID)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: แก้ไขสินค้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       403:
 *         description: คุณไม่มีสิทธิ์เข้าถึงในส่วนนี้ (ต้องเป็น Admin)
 *       404:
 *         description: ไม่พบสินค้า
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.put(
  "/:id",
  upload.single("image"),
  [passport.isLogin, passport.isAdmin],
  productController.update
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: ลบสินค้าตาม ID
 *     description: ลบสินค้าตาม ID โดยต้องเข้าสู่ระบบและมีสิทธิ์เป็น Admin
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสสินค้า (Product ID)
 *     responses:
 *       200:
 *         description: ลบสินค้าสำเร็จ
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       403:
 *         description: คุณไม่มีสิทธิ์เข้าถึงในส่วนนี้ (ต้องเป็น Admin)
 *       404:
 *         description: ไม่พบสินค้า
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.delete(
  "/:id",
  [passport.isLogin, passport.isAdmin],
  productController.delete
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: เพิ่มสินค้าใหม่
 *     description: เพิ่มสินค้าใหม่พร้อมอัปโหลดรูปภาพสินค้า โดยต้องเข้าสู่ระบบและมีสิทธิ์เป็น Admin
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: สินค้าเพิ่มสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: ชื่อสินค้านี้มีอยู่แล้ว
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       403:
 *         description: คุณไม่มีสิทธิ์เข้าถึงในส่วนนี้ (ต้องเป็น Admin)
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.post(
  "/",
  upload.single("image"),
  [passport.isLogin, passport.isAdmin],
  productController.create
);
module.exports = router;
