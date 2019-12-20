const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validate = require('mongoose-validator');

let nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
    }),
    validate({
        validator: 'isAlphanumeric',
        passIfEmpty: true,
        message: 'Name should contain alpha-numeric characters only',
    }),
];

const EmployeeSchema = new Schema({
    name: { type: String, required: true, validate: nameValidator },
    age: { type: Number, required: true },
    position: { type: Schema.Types.ObjectId, ref: 'positions', required: true },
    comment: { type: String }
});

module.exports = mongoose.model('employees', EmployeeSchema, 'employees');
