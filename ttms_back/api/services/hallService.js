// 影厅服务层（业务逻辑）
const hallModel = require('../models/hallModel.js')

const hallService = {
    /**
     * 获取所有影厅列表
     */
    getHallList: async () => {
        const halls = await hallModel.findAll()
        return {
            halls,
            total: halls.length,
            status: 200
        }
    },

    /**
     * 根据影厅ID获取影厅详情
     */
    getHallById: async (id) => {
        const halls = await hallModel.findById(id)
        if (halls.length === 0) {
            throw new Error('影厅不存在')
        }
        return halls[0]
    },

    /**
     * 根据影厅名称模糊搜索影厅
     */
    searchHallsByName: async (name) => {
        const halls = await hallModel.findByName(name)
        return {
            halls,
            total: halls.length,
            status: 200
        }
    },

    /**
     * 创建影厅
     */
    createHall: async (hallData) => {
        // 检查影厅名称是否已存在
        const existingHalls = await hallModel.findByName(hallData.name)
        if (existingHalls.length > 0) {
            throw new Error('影厅名称已存在')
        }

        const result = await hallModel.create(hallData)
        if (result.affectedRows !== 1) {
            throw new Error('创建影厅失败')
        }

        return {
            message: '创建影厅成功',
            id: result.insertId,
            status: 200
        }
    },

    /**
     * 更新影厅信息
     */
    updateHall: async (id, hallData) => {
        // 检查影厅是否存在
        const halls = await hallModel.findById(id)
        if (halls.length === 0) {
            throw new Error('影厅不存在')
        }

        // 如果更新了名称，检查新名称是否与其他影厅冲突
        if (hallData.name) {
            const existingHalls = await hallModel.findByName(hallData.name)
            if (existingHalls.length > 0 && existingHalls[0].id != id) {
                throw new Error('影厅名称已存在')
            }
        }

        // 验证必要字段
        if (hallData.rows && hallData.rows <= 0) {
            throw new Error('影厅行数必须大于0')
        }
        if (hallData.cols && hallData.cols <= 0) {
            throw new Error('影厅列数必须大于0')
        }

        const result = await hallModel.update(id, hallData)
        if (result.affectedRows !== 1) {
            throw new Error('更新影厅失败')
        }

        return { message: '更新影厅成功' }
    },

    /**
     * 删除影厅
     */
    deleteHall: async (id) => {
        // 检查影厅是否存在
        const halls = await hallModel.findById(id)
        if (halls.length === 0) {
            throw new Error('影厅不存在')
        }

        // 检查是否有排片与该影厅关联
        const hasSessions = await hallModel.hasRelatedSessions(id)
        if (hasSessions) {
            throw new Error('该影厅有关联的排片信息，无法删除')
        }

        const result = await hallModel.delete(id)
        if (result.affectedRows !== 1) {
            throw new Error('删除影厅失败')
        }

        return { message: '删除影厅成功' }
    }
}

module.exports = hallService