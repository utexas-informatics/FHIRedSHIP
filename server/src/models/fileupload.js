const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileupload = new Schema(
  {
    name: { type: String, required: true },
    originalName:{ type: String, required: false },
    linking: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'fileuploads' }
);

module.exports = mongoose.model('Fileupload', fileupload);