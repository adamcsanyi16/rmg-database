const mongoose = require("mongoose");

const agazatSchema = new mongoose.Schema(
  {
    agazat: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model("agazat", agazatSchema);
