const mongoose = require('mongoose');
const { isValidID } = require('../utils/validation');

const teacherSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    className: { type: String, required: true },
    idNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isValidID,
            message: props => `תעודת זהות ${props.value} לא תקינה!`
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);