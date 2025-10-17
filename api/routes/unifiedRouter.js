const express = require('express');
const router = express.Router(); // Create the single master router

// --- 1. Import all your existing route files ---
// NOTE: Adjust the paths (e.g., './authRoutes') if these files are in a different directory relative to unifiedRouter.js
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const jobRoutes = require('./jobRoutes');
const applicationRoutes = require('./applicationRoutes');
const savedJobRoutes = require('./savedJobRoutes');
const analyticsRoutes = require('./analyticsRoutes');

// --- 2. Mount each route module onto the master router ---
// The paths here (e.g., "/auth") are combined with the base path 
// set in index.js ("/api") to recreate your original endpoints.

router.use("/auth", authRoutes);        // Final path: /api/auth
router.use("/user", userRoutes);        // Final path: /api/user
router.use("/jobs", jobRoutes);          // Final path: /api/jobs
router.use("/applications", applicationRoutes); // Final path: /api/applications
router.use("/save-jobs", savedJobRoutes); // Final path: /api/save-jobs
router.use("/analytics", analyticsRoutes); // Final path: /api/analytics

// --- 3. Export the single master router ---
module.exports = router;