const Job = require('../models/Job');
const Application = require('../models/Application');

/**
 * @desc    List all active jobs with optional filtering and pagination
 * @route   GET /api/jobs
 * @access  Public
 */
const listJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, type, search } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('applications');

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('applications');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new job listing
 * @route   POST /api/jobs
 * @access  Admin
 */
const createJob = async (req, res, next) => {
  try {
    const { title, company, location, category, description, salary, type } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      category,
      description,
      salary,
      type,
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job listing and all associated applications
 * @route   DELETE /api/jobs/:id
 * @access  Admin
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Remove all related applications
    await Application.deleteMany({ job_id: req.params.id });

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job and all related applications deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications for a specific job
 * @route   GET /api/jobs/:jobId/applications
 * @access  Admin
 */
const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    const applications = await Application.find({ job_id: req.params.jobId }).sort({
      created_at: -1,
    });

    res.status(200).json({
      success: true,
      data: {
        job: { id: job._id, title: job.title, company: job.company },
        applications,
        total: applications.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listJobs,
  getJobById,
  createJob,
  deleteJob,
  getJobApplications,
};
