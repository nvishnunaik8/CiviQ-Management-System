const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password:{type:String,required:true},
  phone: String,
  departmentName: String,
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
});

module.exports = mongoose.model("Employee", employeeSchema);
