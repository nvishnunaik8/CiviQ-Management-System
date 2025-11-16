const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();

// Models
const User = require("./models/user.model");
const Admin = require("./models/admin.model");
const Issue = require("./models/issue.model");
const Employee = require("./models/employee.model");

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
const UsersecretCode =process.env.UserScrtCode;
const AdminSecretCode = process.env.AdminScrtCode
// Test route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// ----------------------
// User Registration
// ----------------------
app.post("/api/register", async (req, res) => {
    const { email, name, password } = req.body;

    const tempuser = await User.findOne({ email });
    if (tempuser) return res.send({ status: "error", error: "Email In Use" });

    try {
        await User.create({ name, email, password });
        res.send({ status: "ok" });
    } catch (e) {
        console.error(e);
        res.send({ status: "error", error: "Network Issues" });
    }
});

// ----------------------
// User Login
// ----------------------
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const admin = await Admin.findOne({ email, password });
        if (admin) {
            const token = jwt.sign(
                { name: admin.name, email: admin.email, role: "superadmin" },
                AdminSecretCode
            );
            return res.send({
                status: "ok",
                token,
                role: "superadmin",
                message: "Admin login successful",
            });
        }
        const employee = await Employee.findOne({ email, password });
        if (employee) {
            const token = jwt.sign(
                { name: employee.name, email: employee.email, role: "employee" },
                AdminSecretCode
            );
            return res.send({
                status: "ok",
                token,
                role: "employee",
                message: "Employee login successful",
            });
        }
        const user = await User.findOne({ email, password });
        if (user) {
            const token = jwt.sign(
                { name: user.name, email: user.email, role: "user" },
                UsersecretCode
            );
            return res.send({
                status: "ok",
                token,
                role: "user",
                message: "User login successful",
            });
        }

        res.status(401).send({ status: "error", error: "Invalid credentials" });

    } catch (e) {
        console.error(e);
        res.send({ status: "error", error: "Network Issues" });
    }
});

// ----------------------
// Submit Issue
// ----------------------
app.post("/api/Generateissue", async (req, res) => {
    const token = req.headers.authorization; // Bearer token
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, UsersecretCode);

        // Fetch the authenticated user
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).send({ ok: false, error: "User not found" });

        const issueData = req.body; // title, category, description, etc.

        // If anonymous, still assign name/email from database
        if (!issueData.is_anonymous) {
            issueData.reporter_name = user.name;
            issueData.reporter_email = user.email;
        }

        // Create issue in Issue collection
        const issue = await Issue.create({ ...issueData });

        // Store the generated ObjectId in user's pending issues
        user.issues.push(issue._id);
        await user.save();

        res.send({ ok: true, status: "ok", id: issue._id, message: "Issue added to pending" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ ok: false, error: "Failed to add issue" });
    }
});


// ----------------------
// Get User Issues (with details)
// ----------------------
app.get("/api/user/issues", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, UsersecretCode);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).send({ ok: false, error: "User not found" });

        const Issues = await Issue.find({ _id: { $in: user.issues } });

        res.send({ ok: true, issues: Issues });
    } catch (err) {
        console.error(err);
        res.status(500).send({ ok: false, error: "Failed to fetch issues" });
    }
});

app.get("/api/AdminDetails", async (req, res) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, AdminSecretCode);
        const admin = await Admin.findOne({ email: decoded.email }).populate({
            path: "departments.employees",
            model: "Employee",
            select: "name email phone password departmentName _id",
        }); 
        if (!admin) return res.status(404).send({ ok: false, error: "Admin not found" });
        const issues = await Issue.find();
        const Departments = admin.departments.map(d => ({
            name: d.name,
            description: d.description,
            head: d.head,
            email: d.email,
            employees: d.employees,

        }));
        res.send({ status: 'ok', Issues: issues, Departments: Departments });
    } catch (e) {
        res.send({ status: 'error', error: e });
    }
})

app.post("/api/admin/AddEmployees", async (req, res) => {
    try {
        const { name, email, password, phone, departmentName } = req.body;
        // Create employee
        const employee = new Employee({
            name,
            email,
            password: password,
            phone,
            departmentName,
        });

        await employee.save();

        // Add employee to the admin's department
        // Assuming you have a single admin, e.g., the first one
        const admin = await Admin.findOne();
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const dept = admin.departments.find((d) => d.name === departmentName);
        if (!dept) return res.status(404).json({ message: "Department not found" });

        dept.employees.push(employee._id);

        await admin.save();

        res.status(201).json({ message: "Employee added successfully", employee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
})

// DELETE Employee by _id
app.delete("/api/admin/DeleteEmployee/:id", async (req, res) => {
    const empId = req.params.id; // employee _id to delete
    const token = req.headers.authorization; // optional: admin token to verify

    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });

    try {
        // Verify admin token
        const decoded = jwt.verify(token, AdminSecretCode);

        // Find the admin
        const admin = await Admin.findOne({ email: decoded.email });
        if (!admin) return res.status(404).send({ ok: false, error: "Admin not found" });

        admin.departments.forEach((dept) => {
            if (dept.employees && dept.employees.length > 0) {
                dept.employees = dept.employees.filter(emp => emp._id.toString() !== empId);
            }
        });

        await admin.save();

        res.send({ ok: true, message: "Employee removed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ ok: false, error: "Failed to remove employee" });
    }
});

app.post("/api/issues/assign/:id", async (req, res) => {
    try {
        const { departmentName, employeeEmail } = req.body;

        // Find the issue by ID
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        // Find the employee by name (you can also match by email)
        const employee = await Employee.findOne({ email: employeeEmail });
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        // Update issue fields
        issue.status = "inprogress";
        issue.assigned_department = departmentName;
        issue.assigned_department_employee = employee.name;
        issue.assigned_date = new Date();

        await issue.save();


        // Push issue to the employee’s issue list
        if (!employee.issues.includes(issue._id)) {
            employee.issues.push(issue._id);
            await employee.save();
        }

        return res.status(200).json({
            ok: true,
            message: "Issue assigned successfully",
            issue,
        });
    } catch (err) {

        console.error("Error assigning issue:", err);
        res.status(500).json({
            message: "Internal server error", ok: false,
        });
    }
});
app.post("/api/issues/changeToResolved/:id", async (req, res) => {
    const issueId = req.params.id;
    const { departmentName, employeeEmail } = req.body;

    try {
        const issue = await Issue.findById(issueId);
        if (!issue) return res.status(404).json({ ok: false, error: "Issue not found" });

        // Check if assigned employee has finished
        if (!issue.assigned_employee_finished) {
            return res.status(400).json({
                ok: false,
                error: `${issue.assigned_employee} has not finished their job yet`,
            });
        }

        // Update issue status
        issue.status = "resolved";
        issue.resolved_date = new Date();

        await issue.save();

        res.json({ ok: true, message: "Issue marked as resolved", issue });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Server error" });
    }
})

app.get("/api/employeeDetails", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, AdminSecretCode);
        const employee=await Employee.findOne({email:decoded.email}).populate("issues");

        if(!employee) return res.status(401).send({ ok: false, error: "No User Found" });
        res.send({ok:true,details:employee});
    } catch (e) {
        return res.status(401).send({ ok: false, error: e });
    }
})

app.get("/api/EmployeeFinishedIssue/:id",async (req,res) => {
    const token=req.headers.authorization;
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });
    const id=req.params.id;
    try{
        const decoded = jwt.verify(token, AdminSecretCode);
        const issue=await Issue.findById(id);
        if(!issue) return res.status(401).send({ ok: false, error: "No Issue Found" });
        issue.assigned_employee_finished=true;
        await issue.save();
        res.send({ok:true});
    }catch(e){
        res.status(401).send({ ok: false, error: "No User Found" })
    }
})

app.put("/api/user/setRating/:id",async(req,res)=>{
    const rating=req.body.rating;
    const feedback=req.body.feedback;
    const token=req.headers.authorization;

    try{
        const decoded = jwt.verify(token, UsersecretCode);
        const issue=await Issue.findById(req.params.id);
        if(!issue) return res.status(401).send({ ok: false, error: "No Issue Found" });
        issue.rating=rating;
        issue.user_feedback=feedback;
        await issue.save();
        res.send({ok:true})
    }catch(e){
        res.status(401).send({ ok: false, error: "No User Found" })

    }
})
// ----------------------
// Start server
// ----------------------
app.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});
