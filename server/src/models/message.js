const mongoose = require('mongoose');

const { Schema } = mongoose;

var message = new Schema(
  {
    roomId: { type: String, required: true },
    moduleId : { type: String, required: true },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    receiverId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
    ntToken:{ type: String, required: true },
    message: { type: String, required: true },
    type: { type: String },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: String, required: false, default: false },
    meta: { type: Object, default: {} },
  },
  { collection: 'messages' }
);

module.exports = mongoose.model('Message', message);
