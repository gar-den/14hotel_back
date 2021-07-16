const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
// router사용안하고 app에 연결한건 supertest로 전체를 다 검사하기 위함인가

// test코드를 먼저 만들때는 request(app).get("api/room") 이렇게 안쓰고 더미 데이터로 두고 검사를 하고 나중에 연결 시키려나?

describe('get /api/room', () => {
  let response;
  beforeAll(async () => {
    response = await request(app).get('/api/room');
  });

  test('방을 가져왔습니다.', (done) => {
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body.rooms)).toBeTruthy(); // definend와 true로 두번 검증한 이유가 있나
    done();
  });
  // 여기서 어떤 것만 하면 좋을 지몰라서 다넣어봄
});

test('방을 db에 등록했습니다.', async (done) => {
  let response = await request(app).post('/api/room').send({
    name: '',
    image: 'https://sbti.kosmes.or.kr/images/content/img_SHSTI040M0_01_01.jpg',
    price: 3000000,
  });
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe('success');
  done();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});
