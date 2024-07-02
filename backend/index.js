const express = require("express");
const db = require("./config/mongoose");
const io = require("./config/socket-io");
const neoSession = require("./config/neo4j");
const cookieParser = require("cookie-parser");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const port = process.env.PORT || 3000;
const userRouter = require("./routes/api/v1/user");
const articleRouter = require("./routes/api/v1/article");
const { indexArticles } = require("./utils/cronjobs");
require("./config/elasticsearch");
const {
	createArticleIndex,
	deleteArticleIndex,
} = require("./elasticsearch/indexCreation");
const { get } = require("config");

db();
createArticleIndex();
// deleteArticleIndex();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(cors());
app.use(cookieParser());
app.use(express.json({ extended: false }));

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);
// app.use(express.static(`${__dirname}/public`));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/article", articleRouter);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

// const articles = new Map();

// io.on("connection", (socket) => {
// 	socket.on("get-document", async (articleId) => {
// 		const article = await findArticleOrCreate(articleId);
// 		console.log(article);
// 		socket.join(articleId);
// 		socket.emit("load-document", article.data);
// 		socket.on("send-changes", (delta) => {
// 			socket.broadcast.to(articleId).emit("receive-changes", delta);
// 			console.log(delta);
// 		});

// 		socket.on("save-document", async (data) => {
// 			const article = await articles.get(articleId);
// 			article.data = data;
// 			articles.set(articleId, article);
// 		});
// 		socket.on("disconnect", () => {
// 			console.log(`Client disconnected from ${articleId}`);
// 		});
// 	});
// 	console.log("connected");
// });

// async function findArticleOrCreate(articleId) {
// 	if (articleId == null) return;
// 	if (articles.has(articleId)) return articles.get(articleId);
// 	articles.set(articleId, { data: "" });
// 	return { data: "" };
// }
// indexArticles();
