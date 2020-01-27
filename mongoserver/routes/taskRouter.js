const router = require("express").Router();
const TaskController = require("../controllers/taskController");
const unggah = require("unggah");

const authenticateParent = require("../middlewares/authenticateParent");
const authenticateChild = require("../middlewares/authenticateChild");
const authenticateParentOrChild = require("../middlewares/authenticateParentOrChild");
const authorizeParent = require("../middlewares/authorizeParentTask");

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

router.patch("/:id/claim", authenticateChild, TaskController.claim);
router.patch(
  "/:id/finish",
  authenticateChild,
  uploadUnggah.single("image"),
  TaskController.finish
);
router.patch("/:id/expire", authenticateParent, TaskController.expire);

router.put(
  "/:id",
  authenticateParent,
  authorizeParent,
  uploadUnggah.single("image"),
  TaskController.update
);
router.delete(
  "/:id",
  authenticateParent,
  authorizeParent,
  TaskController.delete
);

router.get("/:id", authenticateParentOrChild, TaskController.fetchOne);
router.get("/", authenticateParentOrChild, TaskController.fetchAll);

router.post(
  "/",
  authenticateParent,
  uploadUnggah.single("image"),
  TaskController.add
);

module.exports = router;
