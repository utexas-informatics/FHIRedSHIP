const mongoose = require('mongoose');

const { Schema } = mongoose;

const questionnaireresponse = new Schema(
  {
    data: { type: Schema.Types.Mixed, default: {}},
    sid: { type: String },
    patId: {type: String },
    user: { type: String },
    questionnaireId:{ type: Schema.Types.ObjectId, ref: 'Assessment' },
    sharedTempId:{ type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'questionnaireresponses' }
);

module.exports = mongoose.model('Questionnaireresponse', questionnaireresponse);