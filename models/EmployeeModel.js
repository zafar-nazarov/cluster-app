const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    position: { type: Schema.Types.ObjectId, ref: 'positions', required: true },
    comment: { type: String }
});

module.exports = mongoose.model('employees', EmployeeSchema, 'employees');