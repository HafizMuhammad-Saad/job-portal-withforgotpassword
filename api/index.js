require('dotenv').config();
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middleware to handle CORS
app.use(cors());


//Connect database
connectDB();

// Middleware to parse JSON data
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/save-jobs", savedJobRoutes);
app.use("/api/analytics", analyticsRoutes);

//save uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

//start server
// if (process.env.NODE) {

//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

module.exports = app