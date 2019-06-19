const express = require("express");
const router = express.Router();

//@router Get api/posts
//@desc test posts
//@access public
router.get("/", (req, res) => {
  res.send("Post router");
});

module.exports = router;
