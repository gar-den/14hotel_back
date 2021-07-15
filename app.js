const { authMiddleWare } = require("./middleWare");
const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
const allowedOrigins = [
  'http://localhost:3000',
  'http://hotelfourteen.shop',
  'http://121.170.35.72:3000',
  'http://*:3000'
]

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) === -1) {
      const message = "The CORS policy for this site does not allow access from the specified origin";

      return callback(new Error(message), false);
    }

    return callback(null, true);
  }
}));

const session = require("express-session");
const MongoStore = require("connect-mongo");

const connect = require("./schemas");
connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//javascript folder setting
app.use("/static", express.static(__dirname + "/js"));

app.use(express.static("public"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//인증 미들웨어
const router = require("./routers/router");
app.use("/", [router]);

// Making API
const userRouter = require("./routers/user");
app.use("/api/user", [userRouter]);
const roomRouter = require("./routers/room");
app.use("/api/room", [roomRouter]);
const reviewRouter = require("./routers/review");
app.use("/api/review", [reviewRouter]);

//예약기능 인기방 예약방 사진 가져오기
const bookRouter = require("./routers/book");
app.use("/api/book", [bookRouter]);

//Session Setting
// app.use(
//     session({
//       secret: "secret",
//       resave: false,
//       saveUninitialized: false,
//       store: MongoStore.create({
//         mongoUrl: "mongodb://localhost/14hotel",
//       }),
//       cookie: {
//         secure: true,
//         cookie: {
//           //로그인은 하루동안 로그인 유지
//           maxAge: 1000 * 60 * 24,
//         },
//       },
//     })
//   );

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

module.exports = app;
