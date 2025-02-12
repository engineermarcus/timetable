const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    day: String,
    time: String,
    lesson: String
});

module.exports = mongoose.model('Timetable', TimetableSchema);
