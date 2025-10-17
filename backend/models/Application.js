const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    applicant: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    job: {type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true},
    resume: {type: String},
    status: {type: String, default: 'Applied', enum: ['Applied','In Review', 'Accepted', 'Rejected']},
}, {timestamps: true});

module.exports = mongoose.model('Application', applicationSchema);