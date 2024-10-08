// Body欄位檢查 Middleware
export const validateBody = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = new Set(); // 使用 Set 確保唯一性

        // 檢查 req.body（如果需要）
        for (const field of requiredFields) {
            if (!req.body[field]) {
                missingFields.add(field);
            }
        }

        // 如果有缺失的欄位，返回錯誤
        if (missingFields.size > 0) {
            console.log(`Missing required body: ${Array.from(missingFields).join(', ')}`)
            return res.status(400).json({
                status: "error",
                message: `Missing required body fields: ${Array.from(missingFields).join(', ')}`
            });
        } else {
            console.log("Missing required body: Pass")
        }

        next(); // 所有欄位都檢查通過，調用下一個中介軟體或路由處理器
    };
};

// Parameter欄位檢查 Middleware
export const validateParams = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = new Set(); // 使用 Set 確保唯一性

        // 檢查 req.params
        for (const field of requiredFields) {
            if (!req.params[field]) {
                missingFields.add(field);
            }
        }

        // 如果有缺失的欄位，返回錯誤
        if (missingFields.size > 0) {
            console.log(`Missing required params: ${Array.from(missingFields).join(', ')}`)
            return res.status(400).json({
                status: "error",
                message: `Missing required params fields: ${Array.from(missingFields).join(', ')}`
            });
        } else {
            console.log("Missing required body: Pass")
        }

        next(); // 所有欄位都檢查通過，調用下一個中介軟體或路由處理器
    };
};