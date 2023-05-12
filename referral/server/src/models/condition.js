const mongoose = require('mongoose');

const { Schema } = mongoose;

const condition = new Schema(
  {
    data: { type: Schema.Types.Mixed, default: {}},
    sid: { type: String },
    patId: {type: String },
     user: { type: String },
     note: { type: String },
     code: { type: String },
     desc: { type: String },
    questionnaireResponse:{ type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'conditions' }
);

module.exports = mongoose.model('Condition', condition);