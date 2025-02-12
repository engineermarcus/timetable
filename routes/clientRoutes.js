const express = require('express');
const Timetable = require('../models/Timetable');

const router = express.Router();

// Client View Page
router.get('/', async (req, res) => {
    const timetable = await Timetable.find();
    res.render('client', { timetable });
});

module.exports = router;
