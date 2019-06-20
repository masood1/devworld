const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/default.json");
const passport = require("passport");

//@route   GET /api/users
//@desc    Test Users
//@access  Public
router.get("/test", (req, res) => res.send("User route"));

//@route   POST /api/users/register
//@desc    Regsiter User
//@access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "User not found";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm" //Default
      });

      console.log(req.body);
      console.log(req.body.email);
      console.log(req.body.password);
      const newuser = new User({
        name: req.body.name,
        email: req.body.email,
        gravatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        // if (err) throw error;
        console.log(salt);
        bcrypt.hash(newuser.password, salt, (err, hash) => {
          //   if (err) throw error;

          newuser.password = hash;
          newuser
            .save()
            .then(user => {
              res.status(200).json(user);
            })
            .catch(err => {
              console.error(err);
            });
        });
      });
    }
  });
});

//@route   GET /api/users/all
//@desc    Get All Users
//@access  Public
router.get("/all", (req, res) => {
  User.find()
    .then(allUsers => {
      res.status(200).json(allUsers);
    })
    .catch(err => {
      console.log(err);
    });
});

//@route   GET /api/users/login
//@desc    Login Users using JWT
//@access  Public

router.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User Not Found";
      res.status(404).json(errors);
    }
    bcrypt
      .compare(password, user.password)
      .then(isMatch => {
        if (isMatch) {
          //User Is Matched
          let payload = { name: user.name, id: user.id, avatar: user.avatar };

          jwt.sign(
            payload,
            keys.jwtLoginSecret,
            { expiresIn: 3600 },
            (err, token) => {
              token = "Bearer " + token;
              res.json({ msg: "Success", token: token });
            }
          );
        } else {
          errors.password = "Invalid Password";
          res.status(400).json(errors);
        }
      })
      .catch(err => {
        console.log("error in copare bcrypt " + err);
      });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    });
  }
);

module.exports = router;
