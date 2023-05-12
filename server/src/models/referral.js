const mongoose = require('mongoose');

const { Schema } = mongoose;

const referral = new Schema(
  {
    refId: { type: String },
    cbo: { type: String },
    chw: { type: String },
    patient: { type: String },
    acceptedBy:{type:String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status:{ type: String },
    refStatus:{type:String},
    patContacted:{ type: Boolean, default: false },
    isFollowedUp:{ type: Boolean, default: false }
  },
  { collection: 'referrals' }
);

module.exports = mongoose.model('Referral', referral);
