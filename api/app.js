const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const likesRouter = require("./routes/likes");
const authenticationRouter = require("./routes/authentication");
const tokenChecker = require("./middleware/tokenChecker");

const app = express();

// Allow requests from any client
// docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// docs: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());
app.use(express.json({ limit: "14mb" }));
// Parse JSON request bodies, made available on `req.body`
app.use(bodyParser.json());

// API Routes
app.use("/users", usersRouter);
app.use("/posts", tokenChecker, postsRouter, likesRouter, commentsRouter);
// app.use("/posts", tokenChecker, likesRouter);
app.use("/tokens", authenticationRouter);
// app.use("/posts", tokenChecker, commentsRouter);

// 404 Handler
app.use((_req, res) => {
    res.status(404).json({ err: "Error 404: Not Found" });
});

// Error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    if (process.env.NODE_ENV === "development") {
        res.status(500).send(err.message);
    } else {
        res.status(500).json({ err: "Something went wrong" });
    }
});

module.exports = app;
