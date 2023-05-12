const mongoose = require('mongoose');

const { Schema } = mongoose;

const role = new Schema(
    {
        role: { type: String, required: false },
        isActive: { type: Boolean, required: true, default: true },
        createdAt: { type: Date, required: false, default: Date.now },
        updatedAt: { type: Date, required: false, default: Date.now },
      },
    { collection: "roles" }
);

module.exports = mongoose.model('Role', role);


