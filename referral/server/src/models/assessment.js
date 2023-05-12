const mongoose = require('mongoose');

const { Schema } = mongoose;

const assessment = new Schema(
  {
    fhirId: { type: String },
    name: {type: String },
    facility: { type: String },
    createdAt: { type: Date, default: Date.now },
    data : { type: Schema.Types.Mixed, default: {}},
    updatedAt: { type: Date, default: Date.now },
    data : { type: Schema.Types.Mixed, default: {}}
  },
  { collection: 'assessments' }
);

module.exports = mongoose.model('Assessment', assessment);
