const mongoose = require('mongoose');

const { Schema } = mongoose;

const organization = new Schema(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'organizations' }
);

module.exports = mongoose.model('Organization', organization);