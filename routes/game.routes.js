const router = require("express").Router();

let User = require("../model/User");
let isLoggedIn = require("../config/config");

router.post("/addScore", isLoggedIn, async (req, res) => {
  try {
    let { score } = req.body;
    let user = await User.findByIdAndUpdate(req.user._id, {
      $inc: { score: score },
    });

    user = await User.findById(req.user._id, "-password");
    res.status(200).json({ user, message: "Updated !!" });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/addFeedback", isLoggedIn, async (req, res) => {
  try {
    let { feedback } = req.body;
    let user = await User.findByIdAndUpdate(req.user._id, {
      $inc: { feedback: feedback },
    });

    user = await User.findById(req.user._id, "-password");
    res.status(200).json({ user, message: "Updated !!" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
