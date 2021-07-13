const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  image: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
});

// RoomSchema.virtual("roomId").get(() => {
//   return this._id.toHexString();
// }); // make front-end refer this value

// RoomSchema.set("toJSON", {
//   vituals: true,
// });

module.exports = mongoose.model("Room", RoomSchema);
