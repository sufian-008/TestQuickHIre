const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Engineering',
          'Design',
          'Marketing',
          'Sales',
          'Finance',
          'HR',
          'Operations',
          'Product',
          'Data',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      minlength: [50, 'Description must be at least 50 characters'],
    },
    salary: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to get applications count
jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job_id',
  count: true,
});

// Indexes for faster querying
jobSchema.index({ category: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ created_at: -1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
