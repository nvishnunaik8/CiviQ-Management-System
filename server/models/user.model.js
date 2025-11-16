const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }]
});


module.exports = mongoose.model("User", userSchema);
