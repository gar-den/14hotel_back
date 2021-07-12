//안녕하세요잘 가셪가셨습니다.
const express = require("express");
const router = express.Router();
const Book = require("../schemas/book");
const Room = require("../schemas/room");

router.post("/", async (req, res) => {
  let { roomId, adult, kid, startDate, endDate } = req.body;

  endDate = new Date(endDate);
  startDate = new Date(startDate);

  difference = (endDate - startDate) / (1000 * 60 * 60 * 24);

  try {
    const isRoomExist = await Room.findOne({ _id: roomId });
    if (!isRoomExist) {
      // return res.status(401).json({ message: "fail" });
      return res.json({ message: "fail" });
    }

    const tempPrice = isRoomExist.price;
    const price = difference * tempPrice;
    const userId = res.locals.user._id;
    const book = await Book.create({
      roomId,
      startDate,
      endDate,
      adult,
      kid,
      price,
      userId,
    });
    return res.json({ message: "success", bookId: book });
  } catch (e) {
    console.log(e);
    return res.json({ message: "fail" });
  }
});

router.get("/", async (req, res) => {
  const books = await Book.find({}).populate({
    path: "userId",
    select: "nickname",
  });
  return res.json({ books });
});

router.get("/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  const book = await Book.findById(bookId).populate({
    path: "userId",
    select: "nickname",
  });

  res.json({ book });
});

router.put("/:bookId", async (req, res) => {
  const { bookId: _id } = req.params;

  let validate = [];
  for (let item in req.body) {
    if (req.body[item].length !== 0) validate.push(item);
  }

  if (validate.length === 0) return res.json({ message: "fail" });

  try {
    const isExist = await Book.exists({ _id });
    if (!isExist) {
      return res.json({ message: "fail" });
    }

    let { roomId, adult, kid, startDate, endDate } = req.body;

    endDate = new Date(endDate);
    startDate = new Date(startDate);

    difference = (endDate - startDate) / (1000 * 60 * 60 * 24);

    const isRoomExist = await Room.findOne({ _id: roomId });
    if (!isRoomExist) {
      // return res.status(401).json({ message: "fail" });
      return res.json({ message: "fail" });
    }

    const tempPrice = isRoomExist.price;
    const price = difference * tempPrice;

    await Book.updateOne(
      { _id },
      { $set: { adult, kid, startDate, endDate, price } }
    );

    return res.json({ message: "success" });
  } catch (e) {
    console.log(e);
    return res.json({ message: "fail" });
  }
});

router.delete("/:bookId", async (req, res) => {
  const { bookId: _id } = req.params;
  try {
    const isExist = await Book.exists({ _id });
    if (!isExist) {
      return res.status(404).json({ message: "fail" });
    }

    await Book.remove({ _id });

    return res.json({ message: "success" });
  } catch (e) {
    console.log(e);
    return res.json({ message: "fail" });
  }
});

module.exports = router;
