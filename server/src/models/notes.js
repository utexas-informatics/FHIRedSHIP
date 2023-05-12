const mongoose = require('mongoose');

const { Schema } = mongoose;

const note = new Schema(
  {
    moduleId: { type: String},
    notes: { type: String},
    linkWith: { type: String},
    meta:Schema.Types.Mixed,
    submittedBy:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'notes' }
);

module.exports = mongoose.model('Note', note);