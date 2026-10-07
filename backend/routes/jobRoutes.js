const express = require("express");

const {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  deleteJob,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getJobs);

router.get("/my-jobs", protect, getMyJobs);

router.get("/:id", getJobById);

router.post("/", protect, createJob);

router.delete("/:id", protect, deleteJob);

module.exports = router;