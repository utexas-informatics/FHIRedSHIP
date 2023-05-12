const mongoose = require('mongoose');

const { Schema } = mongoose;

const referral = new Schema(
  {
    data: { type: Schema.Types.Mixed, default: {}},
    sid: { type: String },
    user: { type: String },
    cbo: { type: String },
    rawData:{ type: Schema.Types.Mixed, default: {}},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'referrals' }
);

module.exports = mongoose.model('Referral', referral);