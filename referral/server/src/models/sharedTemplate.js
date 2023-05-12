const mongoose = require('mongoose');

const { Schema } = mongoose;

const sharedTemplate = new Schema(
  {
    sharedBy:  { type: String },
    sharedTo: Schema.Types.Mixed,
    templateName: { type: String},
    templateId: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'sharedTemplates' }
);

module.exports = mongoose.model('SharedTemplate', sharedTemplate);
