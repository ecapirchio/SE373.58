const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const hbs = require('hbs');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

app.disable('view cache');

hbs.registerHelper('eq', (a, b) => {
    console.log(`Comparing: ${a} === ${b}`);
    return a === b;
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'hbs');

mongoose.connect('mongodb://localhost:27017/Empl', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use('/', employeeRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
