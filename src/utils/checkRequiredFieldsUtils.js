// 檢查req值是否存在
export const checkRequiredFields = (requiredFields) => {
    const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

    return missingFields;
};