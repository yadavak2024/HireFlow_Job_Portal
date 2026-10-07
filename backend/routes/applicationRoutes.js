const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Candidate applies for a job
router.post("/", protect, applyForJob);


// Candidate's applications
router.get(
  "/my-applications",
  protect,
  getMyApplications
);


// Recruiter's applications
router.get(
  "/recruiter-applications",
  protect,
  getRecruiterApplications
);


// Recruiter updates application status
router.patch(
  "/:id/status",
  protect,
  updateApplicationStatus
);


module.exports = router;