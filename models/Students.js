const mongoose = require('mongoose');
const { isValidID } = require('../utils/validation');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    idNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isValidID,
            message: props => `תעודת זהות ${props.value} לא תקינה!`
        }
    }, className: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);