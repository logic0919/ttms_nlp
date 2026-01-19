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
        const existingUsers = await userModel.findByTel(obj.user_id)
        if (existingUsers.length !== 0) {
            throw new Error('账号被占用')
        }

        // 加密密码
        const hashedPwd = bcryptjs.hashSync(userData.pwd, 10)

        // 创建用户
        const result = await userModel.create({
            ...userData,
            pwd: hashedPwd
        })

        if (result.affectedRows !== 1) {
            throw new Error('注册失败')
        }

        return { message: '注册成功' }
    },

    /**
     * 用户登录
     */
    login: async (userData) => {
        // 验证输入格式
        const regRes = infoRegTest({ flag: 1, ...userData })
        if (!regRes.inf) {
            throw new Error(regRes.msg)
        }

        // 查询用户
        const users = await userModel.findByTel(userData.tel)
        if (users.length !== 1) {
            throw new Error('账号不存在')
        }

        // 验证密码
        const user = users[0]
        if (!bcryptjs.compareSync(userData.pwd, user.pwd)) {
            throw new Error('密码错误')
        }

        // 生成token
        const tokenUser = { ...userData, pwd: '' }
        const tokenStr = jwt.sign(tokenUser, config.jwtSerectKey, {
            expiresIn: '11296000' // 15天
        })

        return {
            message: '登录成功',
            token: 'Bearer ' + tokenStr
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
     * 更新用户信息
     */
    updateUserInfo: async (tel, userData) => {
        const users = await userModel.findByTel(tel)
        if (users.length !== 1) {
            throw new Error('账号不存在')
        }

        const result = await userModel.update(tel, userData)
        if (result.affectedRows !== 1) {
            throw new Error('修改信息失败')
        }

        return { message: '修改信息成功' }
    },

    /**
     * 根据token解析用户信息
     * @param {string} token - JWT token字符串（不带Bearer前缀）
     * @returns {Object} { user_id, isexp, token, status, userInfo }
     */
    parseTokenAndGetUserInfo: async (token) => {
        // 解析token（不验证过期，因为需要返回是否过期）
        let decoded
        try {
            // jwt.decode不验证签名和过期时间，只解析
            decoded = jwt.decode(token)
            if (!decoded) {
                throw new Error('token格式无效')
            }
        } catch (error) {
            throw new Error('token解析失败')
        }

        // 获取user_id（优先从token中取，如果没有则通过tel查询）
        let user_id
        let userInfo

        if (decoded.user_id || decoded.id) {
            // token中包含user_id
            user_id = decoded.user_id || decoded.id
            const users = await userModel.findById(user_id)
            if (users.length === 0) {
                throw new Error('用户不存在')
            }
            userInfo = users[0]
        } else if (decoded.tel) {
            // token中包含tel，先通过tel查询用户，再获取id
            const users = await userModel.findByTel(decoded.tel)
            if (users.length === 0) {
                throw new Error('用户不存在')
            }
            userInfo = users[0]
            user_id = userInfo.id || userInfo.user_id
        } else {
            throw new Error('token中缺少用户标识信息')
        }

        // 检查token是否过期
        const currentTime = Math.floor(Date.now() / 1000) // 当前时间戳（秒）
        const expTime = decoded.exp // token过期时间（秒）
        const isexp = expTime ? currentTime >= expTime : true // 如果没有exp字段，认为已过期

        // 验证token签名（如果未过期）
        let isValidToken = false
        if (!isexp) {
            try {
                jwt.verify(token, config.jwtSerectKey)
                isValidToken = true
            } catch (error) {
                // token签名验证失败
                isValidToken = false
            }
        }

        // 删除密码字段
        const { pwd, ...userInfoSafe } = userInfo

        return {
            user_id: user_id,
            isexp: isexp,
            token: token,
            status: isValidToken && !isexp ? 0 : 1, // 0表示有效，1表示无效或过期
            exp_time: expTime ? new Date(expTime * 1000).toISOString() : null, // 过期时间
            userInfo: userInfoSafe // 用户信息（不含密码）
        }
    }
}

module.exports = userService