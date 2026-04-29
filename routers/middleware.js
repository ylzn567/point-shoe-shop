const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Students');

const validateUserId = async (req, res, next) => {
    try {
        const user = await User.findOne({ idNumber: req.params.id });
        if (!user) {
            return next({ status: 404, message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        next({ status: 500, message: err.message });
    }
};

const validateTeacherId = async (req, res, next) => {
    try {
        const teacher = await Teacher.findOne({ idNumber: req.params.id });
        if (!teacher) {
            return next({ status: 404, message: 'Teacher not found' });
        }
        req.teacher = teacher;
        next();
    } catch (err) {
        next({ status: 500, message: err.message });
    }
};

const validateStudentId = async (req, res, next) => {
    try {
        const student = await Student.findOne({ idNumber: req.params.id });
        if (!student) {
            return next({ status: 404, message: 'Student not found' });
        }
        req.student = student;
        next();
    } catch (err) {
        next({ status: 500, message: err.message });
    }
};

const authenticateToken = (req, res, next) => {
    if (!req.userData) {
        return next({ status: 401, message: 'Access token required' });
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.isAdmin) {
        return next();
    }
    if (req.accepts('html')) {
        return res.status(403).render('login', { error: 'Admin access required' });
    }
    return res.status(403).json({ message: 'Admin access required' });
};

module.exports = {
    validateUserId,
    validateTeacherId,  
    validateStudentId,
    authenticateToken,
    requireAdmin
};
