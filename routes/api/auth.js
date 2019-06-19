const express = require("express");
const router = express.Router();

//@route Get /api/auth
//@desc Auth for test
//@access Public
router.get("/", (req, res) => {
  res.send("Auth Router");
});

module.exports = router;
