const {Schema, model} = require('mongoose');

const followSchema = Schema({
    student: {
        type: Schema.ObjectId,
        ref: "Student"
    },
    followed: {
        type: Schema.ObjectId,
        ref: "Student"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Follow', followSchema); 