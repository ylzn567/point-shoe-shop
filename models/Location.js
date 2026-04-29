const mongoose = require('mongoose');

const studentLocationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    latitude: { 
        type: Number, 
        required: true 
    },
    longitude: { 
        type: Number, 
        required: true 
    }
}, { 
    // במונגו, timestamps נותן לנו אוטומטית שדה createdAt 
    // ולכן אנחנו אפילו לא צריכים להגדיר שדה Timestamp ידנית כמו ב-C#!
    timestamps: true 
});

module.exports = mongoose.model('StudentLocation', studentLocationSchema);