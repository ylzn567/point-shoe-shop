const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: [true, 'נא להזין שם פרטי'],
        trim: true
    },
    lastName: { 
        type: String, 
        required: [true, 'נא להזין שם משפחה'],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'נא להזין אימייל'], 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: [true, 'נא להזין סיסמה']
    },
    isAdmin: { 
        type: Boolean, 
        default: false
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);