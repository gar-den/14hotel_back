const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  // 참조 방식은 정훈님이 알려주시기로!
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  nickname: String,
  date: String,
  title: String,
  content: String,
});

// ReviewSchema.virtual('reviewId').get(() => {
//     return this._id.toHexString();
// }); // make front-end refer this value

// ReviewSchema.set("toJSON", {
//     vituals: true,
// });

module.exports = mongoose.model("Review", ReviewSchema);
