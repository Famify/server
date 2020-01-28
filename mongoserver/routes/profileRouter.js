const router = require("express").Router();
const authenticateParentOrChild = require("../middlewares/authenticateParentOrChild");
const ProfileController = require("../controllers/profileController");

router.get("/", authenticateParentOrChild, ProfileController.checkProfile);

module.exports = router;
