const { uploadFile } = require("../utils/oss.js");
const movieService = require("../services/movieService.js");

const movieController = {
  getMovieList: async (req, res) => {
    try {
      const result = await movieService.getMovieList();
      res.status(200).json({
        success: true,
        message: "获取电影列表成功",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  searchMoviesByTab: async (req, res) => {
    try {
      const id = req.query.tab;
      const result = await movieService.searchMoviesByTab(id);
      res.status(200).json({
        success: true,
        message: "按标签搜索电影成功",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  searchMoviesByChineseName: async (req, res) => {
    try {
      const { chinese_name } = req.query;
      if (!chinese_name) {
        return res.status(400).json({
          success: false,
          message: "请输入电影名",
        });
      }
      const result = await movieService.searchMoviesByChineseName(chinese_name);
      res.status(200).json({
        success: true,
        message: "搜索电影成功",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  searchMoviesById: async (req, res) => {
    try {
      const id = req.query.movie_id;
      const movie = await movieService.searchMoviesById(id);
      res.status(200).json({
        success: true,
        message: "获取电影详情成功",
        data: movie,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  createMovie: async (req, res) => {
    try {
      console.log("表单字段:", req.body);
      console.log("上传文件:", req.files);

      // 上传多个文件到 OSS，返回 URL 数组；没有文件则返回空数组
      // 此时 req.files 是对象格式：{ movie_img: [...], director_img: [...], actor_img: [...] }
      const uploadManyToOSS = async (fieldName) => {
        const files = req.files[fieldName];
        if (!files || files.length === 0) return [];
        const urls = await Promise.all(
          files.map(async (file) => {
            const ext = file.originalname.split(".").pop();
            const key = `${fieldName}/${Date.now()}_${Math.random()
              .toString(36)
              .slice(2)}.${ext}`;
            return await uploadFile(key, file.buffer);
          })
        );
        return urls;
      };

      // 并发上传三种图片
      const [movieImgUrls, directorImgUrls, actorImgUrls] = await Promise.all([
        uploadManyToOSS("movie_img"),
        uploadManyToOSS("director_img"),
        uploadManyToOSS("actor_img"),
      ]);

      const movieData = {
        chinese_name: req.body.chinese_name || "中文名",
        english_name: req.body.english_name || "eng_name",
        category_ids: req.body.category_ids
          ? "0," + req.body.category_ids
          : "0",
        area: req.body.area || "中国大陆",
        show_time:
          req.body.show_time === "NaN-NaN-NaN"
            ? "2026-01-01"
            : req.body.show_time,
        duration: req.body.duration || "120",
        directors: req.body.directors || "director_name",
        actors: req.body.actors || "actor_name",
        introduction: req.body.introduction || "detailIntroduction",

        movie_img:
          movieImgUrls.length > 0
            ? movieImgUrls.join(",")
            : "https://ttms-img.oss-cn-beijing.aliyuncs.com/movie_img/default_movie.jpg",
        director_img:
          directorImgUrls.length > 0
            ? directorImgUrls.join(",")
            : "https://ttms-img.oss-cn-beijing.aliyuncs.com/director_img/default_director.jpg",
        actor_img:
          actorImgUrls.length > 0
            ? actorImgUrls.join(",")
            : "https://ttms-img.oss-cn-beijing.aliyuncs.com/actor_img/default_actor.jpg",
      };

      console.log("处理后的电影数据:", movieData);

      const result = await movieService.createMovie(movieData);
      console.log(result);

      res.status(200).json({
        success: true,
        message: "创建电影成功",
        data: result,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await movieService.updateMovie(id, req.body);
      res.status(200).json({
        success: true,
        message: "更新电影成功",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  getHotList: async (req, res) => {
    try {
      const result = await movieService.getHotList();
      res.status(200).json({
        success: true,
        message: "获取电影列表成功",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  deleteMovie: async (req, res) => {
    try {
      const { movie_id } = req.query;
      const result = await movieService.deleteMovie(movie_id);
      res.status(200).json({
        success: true,
        message: "删除电影成功",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
};

module.exports = movieController;