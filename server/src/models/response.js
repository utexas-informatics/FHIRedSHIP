const mongoose = require('mongoose');

const { Schema } = mongoose;

const response = new Schema(
  {
    moduleId: { type: String},
    templateId:{
        type: Schema.Types.ObjectId,
        ref: 'Template'
      },
    data:Schema.Types.Mixed,
    submittedBy:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'responses' }
);

module.exports = mongoose.model('Response', response);