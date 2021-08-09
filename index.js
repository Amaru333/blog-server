//Setting up express
const express = require("express");
const app = express();

//Setting up multer
const path = require("path");
const multer = require("multer");

app.use("/images", express.static("images"));

//Initializing CORS
const cors = require("cors");
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//Setting up the port
require("dotenv/config");
const PORT = process.env.PORT || 3001;

//JSON parser
app.use(express.json({ limit: "50mb" }));

//Setting up image storage in the server
const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

app.post(
  "/uploadImage",
  imageUpload.single("file"),
  (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//Setting up mongoose and connecting to MongoDB
const mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.connect(
  "mongodb+srv://Amaru333:amaru333@cluster0.fozlt.mongodb.net/blog?retryWrites=true&w=majority",
  { useNewUrlParser: true },
  () => console.log("Connected to the database")
);

//Router

//Users router
const usersRouter = require("./routes/Users");
app.use("/user", usersRouter);

//Posts router
const postsRouter = require("./routes/Posts");
app.use("/post", postsRouter);

//Start the server on port
app.listen(PORT);
