const mongoose = require('mongoose');

const { Schema } = mongoose;

const rule = new Schema(
  {
    templateId: { type: String },
    rules: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'rules' }
);

module.exports = mongoose.model('Rule', rule);