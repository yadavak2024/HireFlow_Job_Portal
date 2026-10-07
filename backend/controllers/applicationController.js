const Application = require("../models/Application");
const Job = require("../models/Job");


// Candidate applies for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Candidate sees own applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id,
    })
      .populate("job", "title company location type salary")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Recruiter sees applications for his jobs
const getRecruiterApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.id,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("candidate", "name email")
      .populate(
        "job",
        "title company location type salary"
      )
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Recruiter updates application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Shortlisted", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const application = await Application.findById(
      req.params.id
    ).populate("job", "recruiter");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (
      application.job.recruiter.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "You are not allowed to update this application",
      });
    }

    application.status = status;

    await application.save();

    const updatedApplication =
      await Application.findById(application._id)
        .populate("candidate", "name email")
        .populate(
          "job",
          "title company location type salary"
        );

    res.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
};