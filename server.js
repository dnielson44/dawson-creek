const express = require("express");
const cors = require("cors");
const { Thread } = require("./model");

const server = express();

server.use(cors());
server.use(express.json({}));
server.use(express.static("public"));

// this is where we will do our own middleware
server.use((req, res, next) => {
  console.log(
    "Time: ",
    Date.now(),
    " - Method: ",
    req.method,
    " - Path: ",
    req.originalUrl,
    " - Body: ",
    req.body
  );
  next();
});

module.exports = server;

// GET /thread
server.get("/thread", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log("getting all threads");
  let findQuery = {};
  if (req.query.author !== null && req.query.author !== undefined) {
    findQuery.author = { $regex: req.query.author };
  }
  if (req.query.name !== null && req.query.name !== undefined) {
    findQuery.name = { $regex: req.query.name };
  }
  Thread.find({}, (err, threads) => {
    if (err != null) {
      res.status(500).json({
        error: err,
        message: "could not list threads",
      });
      return;
    }
    res.status(200).json(threads);
  });
});

// GET /thread/:id
server.get("/thread/:thread_id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`getting thread with id ${req.params.id}`);
  Thread.findById(req.params.thread_id, (err, thread) => {
    if (err) {
      res.status(500).json({
        error: err,
        message: "couldn't list threads",
      });
      return;
    } else if (thread === null) {
      res.status(400).json({
        error: "thread not found",
      });
      return;
    }
    res.status(200).json(thread);
  });
});

// POST /thread
server.post("/thread", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating thread with body`, req.body);
  Thread.create(
    {
      name: req.body.name || "",
      description: req.body.description || "",
      author: req.body.author || "",
      category: req.body.category || "",
    },
    (err, thread) => {
      if (err != null) {
        res.status(500).json({
          message: `post request failed to create thread`,
          error: err,
        });
      }
      res.status(200).json(thread);
    }
  );
});

// DELETE /thread/:id
server.delete("/thread/:thread_id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`attempting to delete thread with id ${req.params.id}`);
  Thread.findByIdAndDelete(
    req.params.thread_id,
    { $pull: { posts: { _id: req.params.post_id } } },
    (err, thread) => {
      if (err != null) {
        res.status(500).json({
          error: err,
          message: "couldn't delete thread",
        });
        return;
      } else if (thread === null) {
        res.status(400).json({
          error: "thread not found",
        });
        return;
      }
      res.status(200).json(thread);
    }
  );
});
// POST /post
server.post("/post", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`creating post with body`, req.body);
  let newPost = {
    author: req.body.author || "",
    body: req.body.body || "",
    thread_id: req.body.thread_id || "",
  };

  Thread.findByIdAndUpdate(
    req.body.thread_id,
    { $push: { posts: newPost } },
    { new: true },
    (err, thread) => {
      if (err != null) {
        res.status(500).json({
          error: err,
          message: "couldn't create post",
        });
        return;
      } else if (thread === null) {
        res.status(404).json({
          error: "thread not found",
        });
        return;
      }
      res.status(201).json(thread.posts[thread.posts.length - 1]);
    }
  );
});

// DELETE /post/:thread_id/:post_id
server.delete("/post/:thread_id/:post_id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(`attempting to delete post with id ${req.params.id}`);
  Thread.findByIdAndUpdate(
    req.params.thread_id,
    {
      $pull: { posts: { _id: req.params.post_id } },
    },
    (err, thread) => {
      if (err != null) {
        res.status(500).json({
          error: err,
          message: "couldn't delete thread",
        });
        return;
      } else if (thread === null) {
        res.status(400).json({
          error: "thread not found",
        });
        return;
      }
      res.status(200).json(thread);
    }
  );
});
