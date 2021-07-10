const express = require('express');
const router = express.Router();
const Room = require('../schemas/room');

// 방 정보 가져오기, 방 타입 보여주는 슬라이드
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({}).exec();

    res.json({ message: 'Success', rooms: rooms });
  } catch (err) {
    res.json({ message: 'fail' });
  }
});

// 방 정보 하나만 가져오기
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId: _Id } = req.params;
    const room = await Room.findOne({ _Id }).exec();
    console.log(room);

    res.json({ message: 'Success', room: room });
  } catch (err) {
    res.json({ message: 'fail' });
  }
});
// 방 정보 등록
router.post('/', async (req, res) => {
  const { name, image, price } = req.body;

  await Room.create({ name: name, image: image, price: price });

  res.json({ message: 'Success' });
});

module.exports = router;