const expres = require("express");
const router = expres.Router();

//@route Get /api/profile
//@desc  Ptofile test
//access Public
router.get("/", (req, res) => {
  res.send("At profile router");
});

module.exports = router;
