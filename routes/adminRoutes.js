const express = require('express');
const bcrypt = require('bcryptjs');
const User  = require('../models/User');
const Timetable = require('../models/Timetable');
const path = require('path');
const router = express.Router();

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { message: null }); 
});

// ✅ FIXED: Use `router.post()` instead of `app.post()`
router.post("/update/:id", async (req, res) => {
    try {
        const { time, lesson } = req.body;

        if (!time || !lesson) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        const result = await Timetable.updateOne({ _id: req.params.id }, { time, lesson });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "No record updated" });
        }

        res.json({ success: true, message: "Update successful" });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login Handler
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await User.findOne({ username });

    if (admin && await bcrypt.compare(password, admin.password)) {
        req.session.admin = admin;
        res.redirect('/admin');
    } else {
        res.sendFile(path.join(__dirname, 'message.html'));
    }
});

// Admin Dashboard
router.get('/', async (req, res) => {
    if (!req.session.admin) return res.redirect('/admin/login');
    const timetable = await Timetable.find();
    res.render('admin', { timetable });
});

// Add Lesson
router.post('/add', async (req, res) => {
    if (!req.session.admin) return res.redirect('/admin/login');
    await Timetable.create(req.body);
    res.redirect('/admin');
});

// Delete Lesson
router.post('/delete/:id', async (req, res) => {
    if (!req.session.admin) return res.redirect('/admin/login');
    await Timetable.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/admin/login'));
});
router.get("/books",(req,res) => {
    filePath = path.join(__dirname,"books.html")
    res.sendFile(filePath)	
});
module.exports = router;
