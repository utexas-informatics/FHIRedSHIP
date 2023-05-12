const mongoose = require('mongoose');

const { Schema } = mongoose;

const appointment = new Schema(
  {
    eventUrl: { type: String, required: true },
    name: { type: String },
    invitee: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    cbo: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    chw: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
      },
    referral:{ type: String },
    status: { type: String },
    cancelUrl: { type: String },
    reScheduleUrl: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    updatedBy:{
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    token: { type: String },
  },
  { collection: 'appointments' }
);

module.exports = mongoose.model('Appointment', appointment);
