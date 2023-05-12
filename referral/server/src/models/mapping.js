const mongoose = require('mongoose');

const { Schema } = mongoose;

const mapping = new Schema(
  {
    sid: { type: String },
    url: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: 'mappings' }
);

module.exports = mongoose.model('Mapping', mapping);
