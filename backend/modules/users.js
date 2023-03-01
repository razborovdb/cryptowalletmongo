const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
    {
        email: { type: String, require: true, minlength: 3, maxlength: 200, unique: true },
        name: { type: String, require: true, minlength: 3, maxlength: 30 },
        avatar: { type: Object, require: true },
        avatarUrl: { type: Object, require: true },
        password: { type: String, require: true, minlength: 3, maxlength: 1024 },
        role: { type: String, require: true, default: "user" },
        isAdmin: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

const Users = mongoose.model("Users", usersSchema);

exports.Users = Users;