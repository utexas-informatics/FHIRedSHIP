const mongoose = require('mongoose');

const { Schema } = mongoose;

const Interventions = new Schema(
  {
    code: { type: String },
    desc: {type: String }
  },
  { collection: 'interventions' }
);

module.exports = mongoose.model('Intervention', Interventions);
