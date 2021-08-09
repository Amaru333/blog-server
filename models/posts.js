const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
  },
  tags: {
    type: Array,
  },
  date: {
    type: String,
  },
  comments: [
    {
      name: String,
      id: String,
      comment: String,
    },
  ],
});

module.exports = mongoose.model("posts", postSchema);
