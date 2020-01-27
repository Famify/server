const router = require("express").Router();
const ChildController = require("../controllers/childController");
const gcsUpload = require("gcs-upload");
const authenticateParent = require("../middlewares/authenticateParent");
const authenticateParentOrChild = require("../middlewares/authenticateParentOrChild");
const authenticateChild = require("../middlewares/authenticateChild");

const upload = gcsUpload({
  limits: {
    fileSize: 1e6, // in bytes
  },
  gcsConfig: {
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE, // this can also be set using GOOGLE_APPLICATION_CREDENTIALS environment variable
    bucketName: process.env.CLOUD_BUCKET,
  },
});

router.post(
  "/signup",
  authenticateParent,
  upload.single("avatar"),
  ChildController.register
);
router.post("/signin", ChildController.login);
router.get("/", authenticateParentOrChild, ChildController.findAll);
router.patch(
  "/:_id",
  authenticateParent,
  upload.single("avatar"),
  ChildController.edit
);
router.delete("/:_id", authenticateParent, ChildController.delete);
router.patch("/:_id/add", authenticateChild, ChildController.addPoint);
router.patch("/:_id/min", authenticateChild, ChildController.minPoint);

module.exports = router;
