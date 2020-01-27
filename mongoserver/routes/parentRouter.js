const router = require("express").Router();
const ParentController = require("../controllers/parentController");
const authenticateParent = require("../middlewares/authenticateParent");
const authenticateParentOrChild = require("../middlewares/authenticateParentOrChild");
const unggah = require("unggah");

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

router.get("/", authenticateParentOrChild, ParentController.findAll);
router.post(
  "/signup",
  uploadUnggah.single("avatar"),
  ParentController.register
);
router.post("/signin", ParentController.login);
router.patch(
  "/:_id",
  authenticateParent,
  uploadUnggah.single("avatar"),
  ParentController.update
);

module.exports = router;
