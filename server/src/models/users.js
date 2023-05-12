const mongoose = require('mongoose');
const { Schema } = mongoose;

//const userStatus = require('./const').userStatus;
const users = new Schema(
  {
    //for patient we need to disable auto object ID
    age: { type: Number },
    sid: { type: String, required: false },
    uuid:{ type: String, required: false },
    uuidEnable:{ type: Boolean, default: true },
    fhiredAppUserID: { type: String }, // in FHIRedApp
    firstName: { type: String, required: false },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    },
    lastName: { type: String, required: false },
    token: { type: String, required: false },
    email: { type: String, required: false },
    phoneNumberPrimary: { type: Number, required: false, minlength: 10 },
    phoneNumberSecondary: { type: Number, required: false, minlength: 10 },
    zipCode: { type: Number, required: false },
    bio: { type: String, required: false },
    role: { type: Schema.Types.ObjectId, required: true, ref: 'Role' },
    uuidLinked:{ type: Boolean, default: false },
    isActive: { type: Boolean, required: true, default: true },
    lockCount: { type: Number, required: true, default: 0 },
    isLocked: { type: Boolean, required: true, default: false },
    reminderSentAt: { type: Date, required: false, default: Date.now },
    createdAt: { type: Date, required: false, default: Date.now },
    updatedAt: { type: Date, required: false, default: Date.now },
    // type: { type: String, default: 'user' },
    adminId: { type: Schema.Types.ObjectId, required: false, ref: 'Users' },
    createdBy: { type: String, default: '' }, //[Admin's User ID] *
    updatedBy: { type: String, default: '' }, //[Admin's User ID] *
    keycloakId: { type: String },
    sid: { type: String },
    facility: { type: String },
    appointmentData:Schema.Types.Mixed
  },
  { collection: 'users' }
); 

module.exports = mongoose.model('Users', users);
