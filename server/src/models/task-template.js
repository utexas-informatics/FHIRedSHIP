const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskTemplate = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    title: { type: String, required: true },
    message: { type: String, required: true },
    message_sp: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    automate_workflow_related:{ type: Boolean, default: false },
    actor : { type: String },
    redirectTo : { type: String },
    pageLink : { type: String },
    sender : { type: String },
    dueTime: { type: String },
    dueTimeType: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: 'taskTemplates' }
);

module.exports = mongoose.model('TaskTemplate', taskTemplate);
