const Teacher = require('../models/Teacher');
const Student = require('../models/Students');
const jwt = require('jsonwebtoken');

// Render teacher registration form
const registerTeacherView = (req, res) => {
    res.render('teacher-register', { error: null, success: false });
};

// Handle teacher registration
const createTeacherView = async (req, res) => {
    try {
        const { firstName, lastName, idNumber, className } = req.body;

        // Check if teacher with this ID already exists
        const existingTeacher = await Teacher.findOne({ idNumber });
        if (existingTeacher) {
            return res.render('teacher-register', { error: 'מורה עם תעודת זהות זו כבר קיימת', success: false });
        }

        const teacher = new Teacher({
            firstName,
            lastName,
            idNumber,
            className
        });

        const savedTeacher = await teacher.save();
        
        // Create JWT token for teacher
        const token = jwt.sign({ 
            id: savedTeacher._id.toString(), 
            role: 'teacher',
            className: savedTeacher.className 
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.redirect(`/teacher-dashboard/${savedTeacher._id}`);
    } catch (err) {
        res.render('teacher-register', { error: err.message, success: false });
    }
};

// Show teacher dashboard with their students
const teacherDashboard = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).render('error', { status: 404, message: 'Teacher not found' });
        }

        const students = await Student.find({ className: teacher.className });
        res.render('teacher-dashboard', { teacher, students, error: null });
    } catch (err) {
        res.status(500).render('error', { status: 500, message: 'Error loading dashboard', details: err.message });
    }
};

// Render student registration form
const registerStudentView = (req, res) => {
    res.render('student-register', { error: null, success: false });
};

// Handle student registration
const createStudentView = async (req, res) => {
    try {
        const { firstName, lastName, idNumber, className } = req.body;

        // Check if student with this ID already exists
        const existingStudent = await Student.findOne({ idNumber });
        if (existingStudent) {
            return res.render('student-register', { error: 'תלמידה עם תעודת זהות זו כבר קיימת', success: false });
        }

        const student = new Student({
            firstName,
            lastName,
            idNumber,
            className
        });

        await student.save();
        res.render('student-register', { error: 'התלמידה נרשמה בהצלחה!', success: true });
    } catch (err) {
        res.render('student-register', { error: err.message, success: false });
    }
};

// Render teacher login form
const loginTeacherView = (req, res) => {
    res.render('login-teacher', { error: null });
};

// Handle teacher login
const loginTeacher = async (req, res) => {
    try {
        const { idNumber, firstName } = req.body;

        // Find teacher by ID and first name
        const teacher = await Teacher.findOne({ idNumber, firstName });
        if (!teacher) {
            return res.render('login-teacher', { error: 'פרטי הזיהוי שגויים' });
        }

        // Create JWT token for teacher
        const token = jwt.sign({ 
            id: teacher._id.toString(), 
            role: 'teacher',
            className: teacher.className 
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.redirect(`/teacher-dashboard/${teacher._id}`);
    } catch (err) {
        res.render('login-teacher', { error: 'שגיאה בכניסה למערכת' });
    }
};

module.exports = {
    registerTeacherView,
    createTeacherView,
    teacherDashboard,
    registerStudentView,
    createStudentView,
    loginTeacherView,
    loginTeacher
};
