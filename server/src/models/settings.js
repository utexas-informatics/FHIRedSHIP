const mongoose = require('mongoose');

const { Schema } = mongoose;

const setting = new Schema(
  {
    moduleId: { type: String},
    type: { type: String},
    isDeleted: { type: Boolean, default: false },
    isEnable: { type: Boolean, default: true },
    meta: Schema.Types.Mixed,
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'settings' }
);

module.exports = mongoose.model('Setting', setting);