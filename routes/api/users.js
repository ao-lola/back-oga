const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const generateToken = require("../../util/util");

const validateRegisterInput = require("../../validator/register");
const validateLoginInput = require("../../validator/login");
//Load user model
const User = require("./models/Users");

//test router
router.get("/test", (req, res) => res.json({ msg: "Userss works" }));

router.post("/addusers", (req, res) => {
  console.log('req body', req.body);
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
     
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        location: req.body.location,
        phone: req.body.phone,
        password: req.body.password,
        is_admin: req.body.is_admin
      });
      //console.log(newUser)

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            return err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.get('/lists', (req, res) => {
  User.find().then(user => {
    if(!user){
      const errors =  "No users found";
      res.status(404).json(errors);
    }
      return res.status(200).json(user);
  })
})

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payLoad = { id: user.id, firstname: user.firstname };

        jwt.sign(
          payLoad,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: token,
              user: user
            });
          }
        );
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
