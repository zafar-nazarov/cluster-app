const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PositionSchema = new Schema({
    name: { type: String, required: true },
    comment: { type: String }
});

module.exports = mongoose.model('positions', PositionSchema, 'positions');