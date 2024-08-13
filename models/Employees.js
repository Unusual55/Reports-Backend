const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const employeeSchema = new mongoose.Schema(
    {
        name: {type: String, require: true},
        id: {type: String, default: uuidv4}
    }
);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
