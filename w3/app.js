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

app.disable('view cache');

// Register Handlebars Helpers
hbs.registerHelper('eq', (a, b) => {
    console.log(`Comparing: ${a} === ${b}`);
    return a === b;
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Express Session (for Authentication)
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set Handlebars as Templating Engine
app.set('view engine', 'hbs');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Empl', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/', employeeRoutes);
app.use('/', authRoutes);
app.use('/', dashboardRoutes); // Dashboard now requires authentication

// Protect the Employee Management System (Require Login)
app.use('/dashboard', authMiddleware, dashboardRoutes);

// Start Server
app.listen(3002, () => console.log('Server running on http://localhost:3002'));
