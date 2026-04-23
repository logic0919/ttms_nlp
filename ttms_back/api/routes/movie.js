const express = require("express");
const router = express.Router();
const multer = require("multer");
const movieController = require("../controllers/movieController.js");
const { verifyToken } = require("../middleware/auth.js");

// memoryStorage：文件存内存，不写磁盘，buffer 直接传给 OSS
const upload = multer({ storage: multer.memoryStorage() });

router.get("/list", movieController.getMovieList);
router.get("/hot", movieController.getHotList);
router.get("/seabyid", movieController.searchMoviesById);
router.get("/seabyname", movieController.searchMoviesByChineseName);
router.get("/seabytab", movieController.searchMoviesByTab);
router.post("/createCoze", verifyToken,movieController.createMovieCoze);

// create 路由加上 multer 中间件，fields 列出所有图片字段名
router.post(
  "/create",
  verifyToken,
  upload.fields([
    { name: "movie_img" },
    { name: "director_img" },
    { name: "actor_img" },
  ]),
  movieController.createMovie
);

router.put("/:id", verifyToken, movieController.updateMovie);
router.delete("/delmovie", verifyToken, movieController.deleteMovie);

module.exports = router;