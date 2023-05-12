const mongoose = require('mongoose');

const { Schema } = mongoose;

const template = new Schema(
  {
    name: { type: String, required: true },
    sections:[Schema.Types.Mixed],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'templates' }
);

module.exports = mongoose.model('Template', template);