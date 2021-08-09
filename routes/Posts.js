const express = require("express");
const router = express.Router();

//Validating token before posting the data
const { validateToken } = require("../middleware/AuthMiddleware");

//Importing posts model
const posts = require("../models/posts");

//Posting the data
router.post("/", validateToken, async (req, res) => {
  const { title, name, description, thumbnail, likes, tags, date } = req.body;

  const post = new posts({
    title: title,
    name: name,
    description: description,
    thumbnail: thumbnail,
    likes: likes,
    tags: tags,
    date: date,
  });

  try {
    const savePost = await post.save();
    res.send(savePost);
  } catch (err) {
    res.send(err);
  }
});

//Getting a specific post
router.get("/byID/:id", async (req, res) => {
  const post = await posts.findOne({
    _id: req.params.id,
  });
  try {
    res.send(post);
  } catch (err) {
    res.send(err);
  }
});

router.post("/likes", async (req, res) => {
  let likeState = req.body.likeState;
  posts.findById(req.body.id, function (err, post) {
    if (err) {
      console.log(err);
    } else {
      if (likeState === false) {
        post.likes -= 1;
        post.save();
      } else {
        post.likes += 1;
        post.save();
      }
    }
  });
});

router.post("/comment", async (req, res) => {
  let comment = {
    name: req.body.name,
    id: req.body.id,
    comment: req.body.comment,
  };

  let postComment = await posts.findById(req.body.postID);
  postComment.comments.push(comment);

  try {
    const updateComment = await postComment.save();
    res.send(updateComment);
  } catch (err) {
    res.send(err);
  }
});

router.get("/", async (req, res) => {
  let query = req.query;
  const post = await posts.find(query, function (err, docs) {
    if (err) return err;
    res.send(docs);
  });
});

router.get("/tags/:id", async (req, res) => {
  let query = req.query;
  const post = await posts.find(query, function (err, docs) {
    if (err) {
      return err;
    } else {
      res.send(docs);
    }
  });
});

module.exports = router;
