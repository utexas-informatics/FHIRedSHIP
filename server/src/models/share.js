const mongoose = require('mongoose');

const { Schema } = mongoose;

const share = new Schema(
  {
    moduleId: { type: String},
    forms:[Schema.Types.Mixed],
    sharedWith:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    sharedBy:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    sharedByType:{ type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'shares' }
);

module.exports = mongoose.model('Share', share);