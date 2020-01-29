const express = require("express");
const router = express.Router();
const parentRouter = require("../routes/parentRouter");
const childrenRouter = require("../routes/childrenRouter");
const rewardRouter = require("../routes/rewardRouter");
const taskRouter = require("../routes/taskRouter");
const profileRouter = require("../routes/profileRouter");
const ImageRouter = require("./image");

router.use("/parents", parentRouter);
router.use("/children", childrenRouter);
router.use("/rewards", rewardRouter);
router.use("/tasks", taskRouter);
router.use("/profile", profileRouter);
router.use("/image", ImageRouter);

module.exports = router;
