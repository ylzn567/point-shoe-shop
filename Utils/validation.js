// utils/validators.js

const isValidID = (id) => {
    // בדיקה שמדובר במחרוזת של 9 ספרות בלבד
    if (!/^\d{9}$/.test(id)) {
        return false;
    }

    // בדיקת ספרת הביקורת
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let digit = Number(id[i]);
        let step = digit * ((i % 2) + 1);
        sum += step > 9 ? step - 9 : step;
    }
    
    return sum % 10 === 0;
};

// ייצוא הפונקציה כדי שנוכל להשתמש בה בקבצים אחרים
module.exports = { isValidID };