const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    requirements: {type: String, required: true},
    location: {type: String},
    category: {type: String},
    type: {type: String, required: true, enum: ['Full-Time', 'Part-Time', 'Internship', 'Remote', 'Contract']},
    company: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // Employer

    salaryMin: {type: Number},
    salaryMax: {type: Number},
    isClosed: {type: Boolean, default: false},

}, {timestamps: true});

module.exports = mongoose.model('Job', jobSchema);