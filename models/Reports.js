const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reportSchema = new mongoose.Schema(
    {
        number: {type: String, default: uuidv4},
        employeeName: {type: String, require: true},
        date: {type: Date},
        startHour: {type: Date},
        endHour: {type: Date},
        comments: {type: String}
    }
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
