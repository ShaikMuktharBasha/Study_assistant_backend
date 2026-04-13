const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  content: { type: String, required: true },
  chunks: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);