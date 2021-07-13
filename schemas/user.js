const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    }
});

// UserSchema.virtual('userId').get(() => {
//     return this._id.toHexString();
// }); // make front-end refer this value

// UserSchema.set("toJSON", {
//     vituals: true,
// });

module.exports = mongoose.model("User", UserSchema);