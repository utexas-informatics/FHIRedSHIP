const mongoose = require('mongoose');

const { Schema } = mongoose;

const notification = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    message_sp:{ type: String, required: false },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'NotificationType',
    },
    notificationType: { type: String, required: false },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    istask: { type: Boolean, default: false },
    url: { type: String },
    senderId: { type: String },
    receiverId: { type: String },
    read: { type: Boolean, default: false },
    senderType: { type: String },
    receiverType: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    meta: Schema.Types.Mixed,
  },
  { collection: 'notifications' }
);

module.exports = mongoose.model('Notification', notification);
