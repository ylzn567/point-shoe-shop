const Teacher = require('../models/Teacher');
const Student = require('../models/Students');

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getTeacherById = async (req, res) => {
    try {
        const teacher = req.teacher;
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getTeacherStudents = async (req, res) => {
    try {
        const teacher = req.teacher;
        const students = await Student.find({ className: teacher.className });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createTeacher = async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        const newTeacher = await teacher.save();
        res.status(201).json(newTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllTeachers,
    getTeacherById,
    getTeacherStudents,
    createTeacher
};
