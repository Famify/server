const router = require("express").Router();
const RewardController = require("../controllers/rewardController");
const unggah = require("unggah");

const authenticateParent = require("../middlewares/authenticateParent");
const authenticateChild = require("../middlewares/authenticateChild");
const authenticateParentOrChild = require("../middlewares/authenticateParentOrChild");
const authorizeParent = require("../middlewares/authorizeParentReward");

const storageConfig = unggah.gcs({
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE, // this can also be set using GOOGLE_APPLICATION_CREDENTIALS environment variable
  bucketName: process.env.CLOUD_BUCKET,
  rename: (req, file) => {
    return `${Date.now()}-${file.originalname}`;
  },
});

const uploadUnggah = unggah({
  storage: storageConfig,
});

router.patch("/:id", authenticateChild, RewardController.claimReward);

router.put(
  "/:id",
  authenticateParent,
  authorizeParent,
  uploadUnggah.single("image"),
  RewardController.update
);
router.delete(
  "/:id",
  authenticateParent,
  authorizeParent,
  RewardController.delete
);

router.get("/:id", authenticateParentOrChild, RewardController.fetchOne);
router.get("/", authenticateParentOrChild, RewardController.fetchAll);

router.post(
  "/",
  authenticateParent,
  uploadUnggah.single("image"),
  RewardController.add
);

module.exports = router;
