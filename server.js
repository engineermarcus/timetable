const path = require('path');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const app = express();
app.use(express.json()); 
// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session for authentication
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));
app.get('/download',(req,res)=>{
    const filePath = path.join(__dirname, 'files','EIC_MATRIX.docx')
	res.download(filePath)
	
});
app.get('/curriculum',(req,res)=>{
	const fileP = path.join(__dirname, 'files','index.html');
	res.sendFile(fileP)
});

// Routes
app.use('/', require('./routes/clientRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Server Start
const PORT =  5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
