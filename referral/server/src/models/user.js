const mongoose = require('mongoose');

const { Schema } = mongoose;

const user = new Schema(
  {
    fhiredAppUserID: { type: String },
    name: { type: String },
    description: { type: String },
    email: { type: String },
    password:{type:String},
    sid: { type: String },
    uuid: { type: String },
    organization: { type: Schema.Types.ObjectId,ref:'Organization' },
    role: { type: String, required: true },
    adminId: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
    facility: { type: String },
    token:{type:String},
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'users' }
);

module.exports = mongoose.model('User', user);
