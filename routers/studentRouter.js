const express = require('express');
const routerStudent = express.Router();
const { getAllStudents, getStudentById, createStudent, getStudentByClassName } = require('../controllers/studentController');
const { validateStudentId } = require('./middleware');

routerStudent.get('/', getAllStudents);

routerStudent.post('/', createStudent);

routerStudent.get('/:id', validateStudentId, getStudentById);

module.exports = routerStudent;
