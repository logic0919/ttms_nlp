// 电影服务层（业务逻辑示例）
const movieModel = require("../models/movieModel.js");
const sessionModel = require("../models/sessionModel.js");

const movieService = {
  /**
   * 获取所有电影列表
   */
  getMovieList: async () => {
    const movies = await movieModel.findAll();
    return {
      movies,
      total: movies.length,
      status: 200,
    };
  },
  /**
   * 获取正在热映（有场次安排）的电影列表
   */
  getHotList: async () => {
    const movies = await movieModel.findMoviesWithSessions();
    return {
      movies,
      total: movies.length,
      status: 200,
    };
  },
  /**
   * 根据标签（tab）搜索电影
   */
  searchMoviesByTab: async (tab) => {
    // 调用模型层查找
    const movies = await movieModel.findByTab(tab);
    return {
      movies,
      total: movies.length,
      status: 200,
    };
  },
  /**
   * 根据chinese_name字段模糊搜索电影
   */
  searchMoviesByChineseName: async (name) => {
    const movies = await movieModel.findByChineseName(name);
    return {
      movies,
      total: movies.length,
      status: 200,
    };
  },

  /**
   * 获取电影详情
   */
  searchMoviesById: async (id) => {
    const movies = await movieModel.findById(id);
    if (movies.length === 0) {
      throw new Error("电影不存在");
    }
    return movies[0];
  },

  /**
   * 创建电影
   */
  createMovie: async (movieData) => {
    // 这里可以添加业务逻辑验证
    const result = await movieModel.create(movieData);
    if (result.affectedRows !== 1) {
      throw new Error("创建电影失败");
    }

    return {
      message: "创建电影成功",
      id: result.insertId,
      status: 200,
    };
  },

  /**
   * 更新电影信息
   */
  updateMovie: async (id, movieData) => {
    // 检查电影是否存在
    const movies = await movieModel.findById(id);
    if (movies.length === 0) {
      throw new Error("电影不存在");
    }

    const result = await movieModel.update(id, movieData);
    if (result.affectedRows !== 1) {
      throw new Error("更新电影失败");
    }

    return { message: "更新电影成功" };
  },

  /**
   * 删除电影
   */
  deleteMovie: async (id) => {
    // 检查电影是否存在
    const movies = await movieModel.findById(id);
    if (movies.length === 0) {
      throw new Error("电影不存在");
    }

    // 检查电影是否有场次安排
    const hasSessions = await sessionModel.checkMovieHasSessions(id);
    if (hasSessions) {
      throw new Error("该电影已有场次安排，无法删除");
    }

    const result = await movieModel.delete(id);
    if (result.affectedRows !== 1) {
      throw new Error("删除电影失败");
    }

    return { message: "删除电影成功" };
  },
};

module.exports = movieService;
