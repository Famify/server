const router = require("express").Router();
const ChildController = require("../controllers/childController");
const authenticateParent = require("../middlewares/authenticateParent");
const authenticateParentOrChild = require("../middlewares/authenticateParentOrChild");
const authenticateChild = require("../middlewares/authenticateChild");
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

router.post(
  "/signup",
  authenticateParent,
  uploadUnggah.single("avatar"),
  ChildController.register
);
router.patch("/:_id/add", authenticateParent, ChildController.addPoint);
router.patch("/:_id/min", authenticateChild, ChildController.minPoint);
router.post("/signin", ChildController.login);
router.get("/", authenticateParentOrChild, ChildController.findAll);
router.get("/user", authenticateChild, ChildController.findUser);
router.patch(
  "/:_id",
  authenticateParentOrChild,
  uploadUnggah.single("avatar"),
  ChildController.edit
);
router.delete("/:_id", authenticateParent, ChildController.delete);

module.exports = router;
