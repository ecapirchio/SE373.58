const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// Home Page
router.get('/', (req, res) => {
    res.render('index', { departments: ['HR', 'Engineering', 'Marketing'] });
});

// Add Employee
router.post('/add', async (req, res) => {
    try {
        const newEmployee = new Employee({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            department: req.body.department,
            startDate: req.body.startDate,
            jobTitle: req.body.jobTitle,
            salary: req.body.salary,
        });

        await newEmployee.save(); // Save the new employee to the database
        res.redirect('/view');   // Redirect to the view page after submission
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).send('Error adding employee');
    }
});

// View Employees
router.get('/view', async (req, res) => {
    const employees = await Employee.find();
    res.render('view', { employees });
});

// Update Employee
router.get('/update/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }

        if (employee.startDate) {
            employee.startDateFormatted = employee.startDate.toISOString().split('T')[0];
        }

        res.render('update', { employee });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).send('Error fetching employee');
    }
});

// Handle Update
router.post('/update/:id', async (req, res) => {
    try {
        const { firstName, lastName, department, startDate, jobTitle, salary } = req.body;

        // Update the employee document
        await Employee.findByIdAndUpdate(req.params.id, {
            firstName,
            lastName,
            department,
            startDate,
            jobTitle,
            salary,
        });

        res.redirect('/view');
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).send('Error updating employee');
    }
});

// Delete Employee
router.post('/delete/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.render('delete', { message: 'Employee deleted successfully!' });
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;
