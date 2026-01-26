// 关于影厅的控制层// 关于影厅的控制层
const hallService = require('../services/hallService'); // 假设存在Hall模型
const hallController = {
    /**
     * 添加影厅
     */
    createHall : async (req, res) => {
        try {
            const savedHall = await hallService.createHall(req.body)
        
            res.status(200).json({
                success: true,
                message: '影厅创建成功',
                data: savedHall
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    /**
     * 删除影厅
     */
    deleteHall : async (req, res) => {
        try {
            const { hall_id } = req.params;
        
            // 验证ID格式（如果是ObjectId）
            if (!isValidId(hall_id)) {
                return res.status(400).json({
                    success: false,
                    message: '无效的影厅ID'
                });
            }
        
            const deletedHall = await hallService.findByIdAndDelete(hall_id);
        
            if (!deletedHall) {
                return res.status(404).json({
                    success: false,
                    message: '未找到指定影厅'
                });
            }
        
            res.status(200).json({
                success: true,
                message: '影厅删除成功'
            });
        } catch (error) {
            console.error('删除影厅错误:', error);
            res.status(500).json({
                success: false,
                message: '服务器内部错误',
                error: error.message
            });
        }
    },

    /**
     * 查看所有影厅信息
     */
    getAllHalls : async (req, res) => {
        try {
            const halls = await hallService.getHallList()
        
            res.status(200).json({
                success: true,
                message: '获取影厅列表成功',
                data: {
                    halls
                }
            });
        } catch (error) {
            console.error('获取影厅列表错误:', error);
            res.status(500).json({
                success: false,
                message: '服务器内部错误',
                error: error.message
            });
        }
    },

    /**
     * 查看某个影厅信息
     */
    getHallById : async (req, res) => {
        try {
            const { hall_id } = req.params;
        
            // 验证ID格式
            if (!isValidId(hall_id)) {
                return res.status(400).json({
                    success: false,
                    message: '无效的影厅ID'
                });
            }
        
            const hall = await hallService.findById(hall_id);
        
            if (!hall) {
                return res.status(404).json({
                    success: false,
                    message: '未找到指定影厅'
                });
            }
        
            res.status(200).json({
                success: true,
                message: '获取影厅信息成功',
                data: hall
            });
        } catch (error) {
            console.error('获取影厅信息错误:', error);
            res.status(500).json({
                success: false,
                message: '服务器内部错误',
                error: error.message
            });
        }
    },

    /**
     * 修改影厅信息
     */
    updateHall : async (req, res) => {
        try {
            const { hall_id } = req.params;
            const updateData = req.body;
        
            // 验证ID格式
            if (!isValidId(hall_id)) {
                return res.status(400).json({
                    success: false,
                    message: '无效的影厅ID'
                });
            }
        
            // 验证更新数据
            const allowedUpdates = ['name', 'rows', 'cols', 'description'];
            const requestedUpdates = Object.keys(updateData);
        
            for (const key of requestedUpdates) {
                if (!allowedUpdates.includes(key)) {
                    return res.status(400).json({
                        success: false,
                        message: `不允许更新字段: ${key}`
                    });
                }
            }
        
            // 检查更新的数据是否有效
            if (updateData.name === '') {
                return res.status(400).json({
                    success: false,
                    message: '影厅名称不能为空'
                });
            }
        
            if (updateData.rows && updateData.rows <= 0) {
                return res.status(400).json({
                    success: false,
                    message: '影厅行数必须大于0'
                });
            }
        
            if (updateData.cols && updateData.cols <= 0) {
                return res.status(400).json({
                    success: false,
                    message: '影厅列数必须大于0'
                });
            }
        
            // 执行更新操作
            const updatedHall = await hallService.findByIdAndUpdate(
                hall_id,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            );
        
            if (!updatedHall) {
                return res.status(404).json({
                    success: false,
                    message: '未找到指定影厅'
                });
            }
        
            res.status(200).json({
                success: true,
                message: '影厅信息更新成功',
                data: updatedHall
            });
        } catch (error) {
            console.error('更新影厅信息错误:', error);
            res.status(500).json({
                success: false,
                message: '服务器内部错误',
                error: error.message
            });
        }
    }
}
module.exports = hallController;