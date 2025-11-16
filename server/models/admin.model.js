const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "admin" },

  departments: [
    {
      name: String,
      description: String,
      head: String,
      email: String,
      employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
