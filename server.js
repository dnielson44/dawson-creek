const express = require("express");
const cors = require("cors");

const server = express();

server.use(cors());
server.use(express.json({}));

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

// this is where we will do our own middleware
server.get("/thread", (req, res) => {
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

// GET /thread/:id
server.get("/thread/:id", (req,res)=>{
    res.setHeader("Content-Type", "application/json");
    console.log(`getting thread with id ${req.params.id}`);
    res.json({});
});

// POST /thread
server.post("/thread", (req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log(`creating thread with body`, req.body);
    res.json({});

});

// DELETE /thread/:id
server.delete("/thread/:id",(req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log(`attempting to delete thread with id ${req.params.id}`);
    res.json({});
})
// POST /post
server.post("/thread", (req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log(`creating post with body`, req.body);
    res.json({});

});

// DELETE /post/:thread_id/:post_id
server.delete("/post/:thread_id/:post_id",(req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log(`attempting to delete post with id ${req.params.id}`)
})