const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const studentSchema = Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: String,
    image: {
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

studentSchema.plugin(mongoosePaginate);

module.exports = model("Student", studentSchema);