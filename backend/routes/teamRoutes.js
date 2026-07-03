const express = require("express");
const {
  createTeam,
  getMyTeam,
  addMember,
  removeMember,
} = require("../controllers/teamController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getMyTeam).post(createTeam);
router.post("/members", addMember);
router.delete("/members/:userId", removeMember);

module.exports = router;
