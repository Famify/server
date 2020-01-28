class ProfileController {
  static checkProfile(req, res, next) {
    const data = req.loggedUser;
    res.status(200).json(data);
  }
}

module.exports = ProfileController;
