//Initializing express router
const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs"); //To encrypt password

//Importing user data model
const users = require("../models/users");

//JSON tokens
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middleware/AuthMiddleware");

//Adding user to the database
router.post("/add", async (req, res) => {
  const { fullName, email, password } = req.body;

  //Checking if mail already exists
  const email_exist = await users.findOne({ mail: email });
  if (email_exist) {
    res.send({ status: 101 }); //Account already exist
  } else if (email === "") {
    res.send({ status: 102 }); //Empty email field
  } else if (fullName === "") {
    res.send({ status: 103 }); //Empty fullName field
  } else if (password.length < 6) {
    res.send({ status: 104 }); //Weak password
  } else {
    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //Creating a user according to user model
    const user = new users({
      name: fullName,
      mail: email,
      password: hashPassword,
    });

    //Saving the user details to the database
    try {
      const saveUser = await user.save();
      res.send({ status: 100 });
    } catch (err) {
      res.send(err);
    }
  }
});

//Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //Checking if email exists in database
  const user = await users.findOne({ mail: email });

  //Email doesn't exist
  if (!user) {
    res.send({ status: 111 });
  } else {
    //Checking if the password matches
    const valid_password = await bcrypt.compare(password, user.password);

    //Password not matching
    if (!valid_password) return res.send({ status: 112 });

    //User credentials are valid
    try {
      const accessToken = sign(
        {
          email: user.mail,
          id: user._id,
          name: user.name,
        },
        "uygUy542uGDS5sf546bFU"
      );
      res.send({
        status: 110,
        accessToken: accessToken,
        name: user.name,
        email: user.mail,
        id: user._id,
      });
    } catch (err) {
      res.send(err);
    }
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
