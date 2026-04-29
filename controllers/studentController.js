const Student = require('../models/Students');

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = req.student;
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getStudentByClassName = async (req, res) => {
    try {
        const students = await Student.find({ className: req.params.className });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    getStudentByClassName,
    createStudent
};
