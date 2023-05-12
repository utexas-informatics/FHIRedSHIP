const mongoose = require('mongoose');

const { Schema } = mongoose;

const icdCodes = new Schema(
  {
    code: { type: String },
    desc: {type: String }
  },
  { collection: 'icd-codes' }
);

module.exports = mongoose.model('Icdcode', icdCodes);
