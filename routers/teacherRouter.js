const express = require('express');
const routerTeacher = express.Router();
const { getAllTeachers, getTeacherById, getTeacherStudents, createTeacher } = require('../controllers/teacherController');
const { validateTeacherId } = require('./middleware');

routerTeacher.get('/', getAllTeachers);

routerTeacher.post('/', createTeacher);

routerTeacher.get('/:id', validateTeacherId, getTeacherById);

routerTeacher.get('/:id/students', validateTeacherId, getTeacherStudents);

module.exports = routerTeacher;
