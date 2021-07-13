// 정원
'use strict';

const express = require("express");
const { authMiddleWare } = require("../middleWare");
const router = express.Router();
const Reviews = require("../schemas/review");
const Users = require("../schemas/user");

// 리뷰 작성
router.post("/", authMiddleWare, async (req, res, next) => {
  const user = res.locals.user;
  const { title, content } = req.body;
  const date = new Date();

    try {
      let review = new Reviews({title: title, nickname: user.nickname, content: content, date: date, userId: user._id})

        await review.save();

        review = await Reviews.findOne({ date });

        const review_id = review._id;

        res.status(201).json({ message: "success", reviewId: review_id });
    } catch(err) {
        res.status(500).json({ err: err, message: "fail" });
    }
    
});

// 리뷰 전체 가져오기
router.get("/", async (req, res, next) => {
  try {
    const reviews = await Reviews.find({});

    console.log(reviews);
    if (reviews) {
      //const reviews = await Reviews.find({}).populate({ path: "userId",model: 'User', select: "nickname" });
      const reviews = await Reviews.find({})
    }
    res.status(201).json({ message: "success", reviews: reviews });
    } catch (err) {
      console.log(err);
        res.status(501).json({ err: err, message: "fail" });
    }
});

// 리뷰 하나 가져오기
router.get("/:reviewId", async (req, res, next) => {
  const { reviewId } = req.params;

    try {
        //const review = await Reviews.findOne({ _id: reviewId }).populate({ path: "userId", select: "nickname" });
        const review = await Reviews.findOne({ _id: reviewId })

        res.status(201).json({ message: "success", review: review });
    } catch (err) {
        res.status(501).json({ err: err, message: "fail" });
    }
});

// 리뷰 하나 수정하기
router.put("/:reviewId", authMiddleWare, async (req, res, next) => {
  const { reviewId } = req.params;
  const { title, content } = req.body;

  const review = await Reviews.findOne({_id: reviewId})
  const userId = review.userId;

  if (String(userId) !== String(res.locals.user._id)) {
    res.status(501).json({ message: "fail" });

    return;
  }

    try {
        await Reviews.updateOne({ _id: reviewId }, {$set: {title, content, date: new Date()}});

        res.status(201).json({ message: "success" });
    } catch (err) {
      console.log("catch");
        res.status(501).json({ err: err, message: "fail" });
    }

});

// 리뷰 하나 삭제하기
router.delete("/:reviewId", authMiddleWare, async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Reviews.findOne({_id: reviewId})
  const userId = review.userId;
  if (String(userId) !== String(res.locals.user._id)) {
    res.status(501).json({ message: "fail" });

    return;
  }

    try {
        await Reviews.deleteOne({ _id: reviewId });

        res.status(201).json({ message: "success" });
    } catch (err) {
        res.status(501).json({ err: err, message: "fail" });
    }
});

module.exports = router;
