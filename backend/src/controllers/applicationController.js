const Application = require('../models/Application');
const Job = require('../models/Job');

/**
 * @desc    Submit a new job application
 * @route   POST /api/applications
 * @access  Public
 */
const submitApplication = async (req, res, next) => {
  try {
    const { job_id, name, email, resume_link, cover_note } = req.body;

    // Verify the job exists and is active
    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job listing is no longer accepting applications',
      });
    }

    const application = await Application.create({
      job_id,
      name,
      email,
      resume_link,
      cover_note,
      user_id: req.user ? req.user._id : null, // link to logged-in user if present
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application },
    });
  } catch (error) {
    // Handle duplicate application (same email + job_id)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job with this email address',
      });
    }
    next(error);
  }
};

/**
 * @desc    List all applications (with optional filters)
 * @route   GET /api/applications
 * @access  Admin
 */
const listApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, job_id } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (job_id) filter.job_id = job_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Application.countDocuments(filter);

    const applications = await Application.find(filter)
      .populate('job_id', 'title company location')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        applications,
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
 * @desc    Get a single application by ID
 * @route   GET /api/applications/:id
 * @access  Admin
 */
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      'job_id',
      'title company location category'
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status
 * @route   PATCH /api/applications/:id/status
 * @access  Admin
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('job_id', 'title company');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get current logged-in job seeker's own applications
 * @route   GET /api/applications/my
 * @access  Protected (jobseeker)
 */
const getMyApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { user_id: req.user._id };
    const total = await Application.countDocuments(filter);

    const applications = await Application.find(filter)
      .populate('job_id', 'title company location type isActive')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        applications,
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

module.exports = {
  submitApplication,
  listApplications,
  getApplicationById,
  updateApplicationStatus,
  getMyApplications,
};
