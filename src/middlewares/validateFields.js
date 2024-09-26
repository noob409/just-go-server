// 通用欄位檢查 Middleware
export const validateFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = new Set(); // 使用 Set 確保唯一性

        // 檢查 req.params
        for (const field of requiredFields) {
            if (!req.params[field]) {
                missingFields.add(field);
            }
        }

        // 檢查 req.body（如果需要）
        for (const field of requiredFields) {
            if (!req.body[field]) {
                missingFields.add(field);
            }
        }

        // 如果有缺失的欄位，返回錯誤
        if (missingFields.size > 0) {
            return res.status(400).json({
                status: "error",
                message: `Missing required fields: ${Array.from(missingFields).join(', ')}`
            });
        }

        next(); // 所有欄位都檢查通過，調用下一個中介軟體或路由處理器
    };
};