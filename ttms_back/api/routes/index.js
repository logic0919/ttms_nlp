// 路由入口文件，统一注册所有路由模块
const express = require("express");
const router = express.Router();

// 导入各个模块的路由
const userRoutes = require("./user.js");
const movieRoutes = require("./movie.js");
const hallRoutes = require("./hall.js");
const sessionRoutes = require("./session.js");
const orderRoutes = require('./order.js')

// 注册路由
router.use("/api/user", userRoutes);
router.use("/api/movie", movieRoutes);
router.use("/api/hall", hallRoutes);
router.use("/api/session", sessionRoutes);
router.use('/api/order', orderRoutes)

module.exports = router;
