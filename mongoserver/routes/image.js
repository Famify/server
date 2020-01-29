const router = require("express").Router();
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

router.post("/", uploadUnggah.single("image"), (req, res) => {
  res.send(req.file.url);
});

module.exports = router;
