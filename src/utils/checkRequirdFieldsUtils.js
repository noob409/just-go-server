// 檢查req值是否存在 
export const checkRequiredFields = (fields) => {
    const missingFields = [];
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            missingFields.push(key);
        }
    }
    return missingFields;
};