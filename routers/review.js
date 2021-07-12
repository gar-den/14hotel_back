// 정원

const express = require("express");
const { authMiddleWare } = require("../middleWare");
const router = express.Router();
const Reviews = require("../schemas/review");
const Users = require("../schemas/user");



// 리뷰 작성
router.post("/", authMiddleWare, async (req, res, next) => {
  console.log(res.locals.user);

  const { title, content } = req.body;
  const date = new Date();

    try {
        await Reviews.create({ title: title, content: content, date: date, userId: res.locals.user._id });

        review = await Reviews.find({ }).sort({'_id': -1}).limit(1);

        review = String(review).split("_id: ")[1];
        reviewId = review.split(",")[0];

        res.status(201).json({ message: "success", reviewId: reviewId });
    } catch(err) {
        res.status(500).json({ err: err, message: "fail" });
    }
    
});

// 리뷰 전체 가져오기
router.get("/", async (req, res, next) => {
  try {
    const reviews = await Reviews.find({}).populate({ path: "userId", select: "nickname" });

        res.status(201).json({ message: "success", reviews: reviews });
    } catch (err) {
        res.status(501).json({ err: err, message: "fail" });
    }
});

// 리뷰 하나 가져오기
router.get("/:reviewId", async (req, res, next) => {
  const { reviewId } = req.params;

    try {
        const review = await Reviews.findOne({ _id: reviewId }).populate({ path: "userId", select: "nickname" });

        res.status(201).json({ message: "success", review: review });
    } catch (err) {
        res.status(501).json({ err: err, message: "fail" });
    }
});

// 리뷰 하나 수정하기
router.put("/:reviewId", authMiddleWare, async (req, res, next) => {
  const { reviewId } = req.params;
  const { title, content } = req.body;

  const userId = await Reviews.findById(reviewId).userId;
  if (res.locals.user.userId != userId) {
    res.status(501).json({ err: err, message: "fail" });
  }

    try {
        await Reviews.updateOne({ _id: reviewId }, {$set: {title, content, date: new Date()}});

        res.status(201).json({ message: "success" });
    } catch (err) {
        res.status(501).json({ err: err, message: "fail" });
    }

});

// 리뷰 하나 삭제하기
router.delete("/:reviewId", authMiddleWare, async (req, res, next) => {
  const { reviewId } = req.params;

  const userId = await Reviews.findById(reviewId).userId;
  if (res.locals.user.userId != userId) {
    res.status(501).json({ err: err, message: "fail" });
  }

    try {
        await Reviews.deleteOne({ _id: reviewId });

        res.status(201).json({ message: "success" });
    } catch (err) {
        res.status(501).json({ err: err, message: "fail" });
    }
});

module.exports = router;
