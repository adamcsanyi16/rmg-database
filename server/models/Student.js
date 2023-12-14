const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    nev: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model("student", studentSchema);