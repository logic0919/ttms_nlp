// 用户服务层（业务逻辑）
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config.js')
const userModel = require('../models/userModel.js')
const { infoRegTest } = require('../utils/validation.js')

const userService = {
    /**
     * 用户注册
     */
    register: async (obj) => {
        // 检查账号是否被占用
        const existingUsers = await userModel.findById(obj.user_id)
        if (existingUsers.length !== 0) {
            throw new Error('账号被占用')
        }
        // 加密密码
        const hashedPwd = bcryptjs.hashSync(obj.pwd, 10)
        // 创建用户
        const result = await userModel.create({
            ...obj,
            pwd: hashedPwd
        })
        if (result.affectedRows !== 1) {
            throw new Error('注册失败')
        }
        // async函数会自动将其转换为
        // Promise.reject(new Error('账号被占用'))

        return { message: '注册成功' }
        // 默认包装成promise对象
        // Promise.resolve({ message: '注册成功' })
    },

    /**
     * 用户登录
     */
    login: async (userData) => {
        // 查询用户
        const users = await userModel.findById(userData.user_id)
        if (users.length !== 1) {
            throw new Error('账号不存在')
        }

        // 验证密码
        const user = users[0]
        console.log(user);
        
        if (!bcryptjs.compareSync(userData.pwd, user.pwd)) {
            throw new Error('密码错误')
        }

        // 生成token
        const tokenUser = { user_id: user.user_id, status: user.status }
        const tokenStr = jwt.sign(tokenUser, config.jwtSerectKey, {
            expiresIn: '11296000' // 15天
        })

        return {
            message: '登录成功',
            data: { token: 'Bearer ' + tokenStr, user_id:user.user_id,status:user.status}
        }
    },

    /**
     * 获取用户信息
     */
    getUserInfo: async (tel) => {
        const users = await userModel.findByTel(tel)
        if (users.length !== 1) {
            throw new Error('账号不存在')
        }

        const user = { ...users[0] }
        // 删除密码字段
        delete user.pwd
        return user
    },

    /**
     * 根据token解析用户信息
     * @param {string} token - JWT token字符串（不带Bearer前缀）
     * @returns {Object} { user_id, isexp, token, status, userInfo }
     */
    parseTokenAndGetUserInfo: async (token) => {
        // 首先判断是否合格，也就是verify
        // 判断哪些呢？格式和时间都会被判断吗？

        // 如果合格：
        // 获取其中的数据，也就是user_id status 空pwd
        // 是否需要根据user_id再去数据库中检索信息？
        // 为了简化，不去数据库中

        // 然后判断是否只剩一小时之内
        // 若是，颁发新token
        // 否则，生成新的token，也就是sign
        try {
            // 1.先验证
            const user = jwt.verify(token, config.jwtSerectKey)
            // 2.此时拿到了user_id和status信息，那么生成新的token
            // 计算token还剩多久过期
            const {status,user_id,exp}=user
            const now = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
            const timeLeft = exp - now; // token 剩余时间（秒）
            let newToken;
            let isexp = false;
            if (timeLeft <= 60 * 60) { // 剩余不足1小时
                // 生成新token，有效期2天
                const payload = { user_id: user_id, status: status }
                newToken = jwt.sign(payload, config.jwtSerectKey, { expiresIn: 2 * 24 * 60 * 60 }); // 2天
            } else {
                // 沿用原来的token
                newToken = token;
            }
            if (timeLeft <= 0) {
                isexp = true;
            }
            return {
                message: 'Token验证成功',
                data: {
                    user_id: user_id,
                    isexp,
                    token: 'Bearer ' + newToken,
                    status: status,
                }
            }
        } catch (error) {
            throw new error('Token无效或过期')
        }
    }
}

module.exports = userService