// Form validators for MEDTRACK

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validatePhone = (phone) => {
    const re = /^[+]?[\d\s\-().]{7,20}$/;
    return re.test(phone);
};

export const validateBMI = (bmi) => {
    const n = parseFloat(bmi);
    return !isNaN(n) && n > 0 && n < 100;
};

export const validateAge = (age) => {
    const n = parseInt(age);
    return !isNaN(n) && n >= 1 && n <= 120;
};

export const validateGlucose = (glucose) => {
    const n = parseFloat(glucose);
    return !isNaN(n) && n >= 0 && n <= 500;
};

export const validateCholesterol = (chol) => {
    const n = parseFloat(chol);
    return !isNaN(n) && n >= 0 && n <= 600;
};

export const isEmpty = (value) => {
    return !value || value.toString().trim() === '';
};

export const getHealthScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
};
