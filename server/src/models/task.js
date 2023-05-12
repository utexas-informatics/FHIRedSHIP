const mongoose = require('mongoose');

const { Schema } = mongoose;

const task = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    message: { type: String },
    message_sp: { type: String },
    notifiedUserId:{
       type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    notifiedUserType: { type: String },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    status: { type: String, required: true, default: 'New' },
    senderType: { type: String },
    actorType: { type: String },
    url: { type: String },
    isDeleted: { type: Boolean, default: false },
    isAutomate: { type: Boolean, default: false },
    automate_workflow_related:{ type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    dueDate: { type: Date },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    meta: Schema.Types.Mixed,
  },
  { collection: 'tasks' }
);

module.exports = mongoose.model('Task', task);
