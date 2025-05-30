const mongoose = require('mongoose');

const ApprovalRequestSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ApprovalRequest', ApprovalRequestSchema);
