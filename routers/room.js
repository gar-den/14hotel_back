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

// {
// 	"name":"디럭스룸",
// 	"image":"https://lh3.googleusercontent.com/proxy/HgYqa1q_cG2uDk1XzgDlnyC7krSSNw9cWm3St5B_v9Q6krPjCyJ683GzneOjks8VxtIyRp1fT_8zu3_BUY1XUKlTj-A_AA1Eq-Yp",
// 	"price": 3000000
// }
// {
// 	"name":"스위트룸",
// 	"image":"https://img.huffingtonpost.com/asset/5d7191b3240000d117768ec2.jpeg?ops=scalefit_630_noupscale",
// 	"price": 4000000
// }
// {
// 	"name":"슈페리어룸",
// 	"image":"https://t2.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/wlQ/image/plkDM1imeDi_Vh43jG7-zqHd3js.jpg",
// 	"price": 5000000
// }
// {
// 	"name":"온돌방",
// 	"image":"https://www.gyeongju.go.kr/upload/content/thumb/20191227/6EB39AAF78444A7E9DFAA1A9E5D8C225.jpg",
// 	"price": 8000000
// }
// {
// 	"name":"싱글룸",
// 	"image":"https://www.hoteltheplaza.com/m/_resource/images/room/thumb_premier_suite.jpg",
// 	"price": 1000000
// }

module.exports = router;
