// insertData.js
const mongoose = require("mongoose");
const Issue = require("./models/issue.model"); // replace with the correct path

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Hackathon", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error(err));

// Sample data
const issues = [
  {
    title: "Pothole on MG Road",
    category: "Road",
    description: "Large pothole causing traffic issues",
    photo: "",
    address: "MG Road, Bengaluru",
    latitude: "12.9716",
    longitude: "77.5946",
    reporter_name: "Rohit Sharma",
    reporter_email: "rohit.sharma@gmail.com",
    is_anonymous: false,
    status: "pending",
  },
  {
    title: "Street light not working",
    category: "Electricity",
    description: "Street light not functioning for 2 weeks",
    photo: "",
    address: "Connaught Place, Delhi",
    latitude: "28.6328",
    longitude: "77.2197",
    reporter_name: "Anjali Verma",
    reporter_email: "anjali.verma@gmail.com",
    is_anonymous: true,
    status: "inprogress",
  },
  {
    title: "Garbage pileup",
    category: "Sanitation",
    description: "Garbage not collected for 5 days",
    photo: "",
    address: "Andheri West, Mumbai",
    latitude: "19.1190",
    longitude: "72.8460",
    reporter_name: "Siddharth Mehra",
    reporter_email: "siddharth.mehra@gmail.com",
    is_anonymous: false,
    status: "resolved",
  },
  {
    title: "Water leakage",
    category: "Water Supply",
    description: "Leakage near main road causing water wastage",
    photo: "",
    address: "Salt Lake, Kolkata",
    latitude: "22.5800",
    longitude: "88.4345",
    reporter_name: "Priya Nair",
    reporter_email: "priya.nair@gmail.com",
    is_anonymous: true,
    status: "pending",
  },
  {
    title: "Traffic signal malfunction",
    category: "Traffic",
    description: "Signal stuck on red at busy junction",
    photo: "",
    address: "Park Street, Kolkata",
    latitude: "22.5600",
    longitude: "88.3639",
    reporter_name: "Arjun Reddy",
    reporter_email: "arjun.reddy@gmail.com",
    is_anonymous: false,
    status: "inprogress",
  },
  {
    title: "Fallen tree blocking road",
    category: "Road",
    description: "Tree fell during storm, blocking traffic",
    photo: "",
    address: "MG Road, Pune",
    latitude: "18.5204",
    longitude: "73.8567",
    reporter_name: "Neha Singh",
    reporter_email: "neha.singh@gmail.com",
    is_anonymous: true,
    status: "resolved",
  },
  {
    title: "Public toilet unhygienic",
    category: "Sanitation",
    description: "Needs cleaning and maintenance",
    photo: "",
    address: "Banjara Hills, Hyderabad",
    latitude: "17.4437",
    longitude: "78.3832",
    reporter_name: "Vikram Kumar",
    reporter_email: "vikram.kumar@gmail.com",
    is_anonymous: false,
    status: "pending",
  },
  {
    title: "Illegal parking",
    category: "Traffic",
    description: "Vehicles parked on sidewalk",
    photo: "",
    address: "Indiranagar, Bengaluru",
    latitude: "12.9719",
    longitude: "77.6412",
    reporter_name: "Shreya Patel",
    reporter_email: "shreya.patel@gmail.com",
    is_anonymous: true,
    status: "inprogress",
  },
  {
    title: "Water tank leakage",
    category: "Water Supply",
    description: "Water leakage from public tank",
    photo: "",
    address: "Paltan Bazar, Guwahati",
    latitude: "26.1821",
    longitude: "91.7450",
    reporter_name: "Rahul Jain",
    reporter_email: "rahul.jain@gmail.com",
    is_anonymous: false,
    status: "resolved",
  },
  {
    title: "Damaged footpath",
    category: "Road",
    description: "Cracked footpath causing accidents",
    photo: "",
    address: "Marine Drive, Mumbai",
    latitude: "18.9433",
    longitude: "72.8236",
    reporter_name: "Meera Joshi",
    reporter_email: "meera.joshi@gmail.com",
    is_anonymous: true,
    status: "pending",
  },
];

// Insert data
Issue.insertMany(issues)
  .then(() => {
    console.log("Data inserted successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error inserting data:", err);
  });
