require('dotenv').config(); // ✅ Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const hbs = require('hbs');
const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// ✅ Debug Route (Check if Express is Running)
app.get('/debug', (req, res) => {
    res.send('✅ Express is running on Vercel or Render!');
});

// ✅ Disable view cache for better development experience
app.disable('view cache');

// ✅ Register Handlebars Helpers
hbs.registerHelper('eq', (a, b) => a === b);

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// ✅ Express Session (For Authentication)
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookies in production
}));

// ✅ Set Handlebars as Templating Engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// ✅ MongoDB Connection with Error Handling
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);  // Stop app if MongoDB connection fails
});

// ✅ Routes
app.use('/', employeeRoutes);
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/dashboard', authMiddleware, dashboardRoutes);

// ✅ Error Handling Middleware (Catch All Internal Errors)
app.use((err, req, res, next) => {
    console.error('❌ Internal Server Error:', err);
    res.status(500).send('Something went wrong! Check logs.');
});

// ✅ Catch Unhandled Errors
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// ✅ Ensure Express Listens on the Correct Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
