const mongoose = require("mongoose");

const compSchema = new mongoose.Schema(
  {
    nev: {
      type: String,
      required: true,
    },
    vtipus: {
      type: String,
      required: true,
    },
    vszint: {
      type: String,
      required: true,
    },
    verseny: {
      type: String,
      required: true,
    },
    agazat: {
      type: String,
      required: true,
    },
    vforma: {
      type: String,
      required: false,
    },
    helyezes: {
      type: String,
      required: false,
    },
    tanulok: {
      type: String,
      required: false,
    },
    tanarok: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("competition", compSchema);
