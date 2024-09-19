var express = require("express");
var router = express.Router();
const cartController = require("../controller/cartController");
const passport = require("../middleware/passpostJWT");
/**
 * @swagger
 * /carts:
 *   post:
 *     summary: เพิ่มสินค้าลงตะกร้า
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: รหัสผู้ใช้
 *               productId:
 *                 type: string
 *                 description: รหัสสินค้า
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: จำนวนสินค้าที่ต้องการเพิ่ม (ต้องมากกว่า 0)
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: เพิ่มสินค้าลงตะกร้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบผู้ใช้หรือสินค้า
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.post("/", [passport.isLogin], cartController.addToCart);

/**
 * @swagger
 * /carts/{userId}/increase:
 *   patch:
 *     summary: เพิ่มจำนวนสินค้าในตะกร้า
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสตะกร้าสินค้า
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: รหัสสินค้า
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: จำนวนที่ต้องการเพิ่ม (ต้องมากกว่า 0)
 *             required:
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: เพิ่มจำนวนสินค้าในตะกร้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       404:
 *         description: ไม่พบตะกร้าสินค้าหรือสินค้าในตะกร้า
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.patch(
  "/:userId/increase",
  [passport.isLogin],
  cartController.increaseQuantity
);

/**
 * @swagger
 * /carts/{userId}/decrease:
 *   patch:
 *     summary: ลดจำนวนสินค้าในตะกร้า
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสตะกร้าสินค้า
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: รหัสสินค้า
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: จำนวนที่ต้องการลด (ต้องมากกว่า 0)
 *             required:
 *               - productId
 *               - quantity
 *     responses:
 *       200:
 *         description: ลดจำนวนสินค้าในตะกร้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       404:
 *         description: ไม่พบตะกร้าสินค้าหรือสินค้าในตะกร้า
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.patch(
  "/:userId/decrease",
  [passport.isLogin],
  cartController.decreaseQuantity
);

/**
 * @swagger
 * /carts/{userId}/products/{productId}:
 *   delete:
 *     summary: ลบสินค้าออกจากตะกร้า
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสตะกร้าสินค้า
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสสินค้าที่ต้องการลบ
 *     responses:
 *       200:
 *         description: ลบสินค้าออกจากตะกร้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       404:
 *         description: ไม่พบตะกร้าสินค้าหรือสินค้าในตะกร้า
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.delete(
  "/:userId/products/:productId",
  [passport.isLogin],
  cartController.removeFromCart
);

/**
 * @swagger
 * /carts/{userId}:
 *   get:
 *     summary: ดึงข้อมูลตะกร้าสินค้าตาม ID
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสตะกร้าสินค้าที่ต้องการดึงข้อมูล
 *     responses:
 *       200:
 *         description: ข้อมูลของตะกร้าสินค้า
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized (ยังไม่เข้าสู่ระบบ)
 *       404:
 *         description: ไม่พบตะกร้าสินค้า
 *       500:
 *         description: เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์
 */
router.get("/:userId", [passport.isLogin], cartController.getCart);

module.exports = router;
