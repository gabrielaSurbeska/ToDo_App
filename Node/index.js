const express = require('express');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Override method middleware
app.use((req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
});

// Mock tasks array
let tasks = [];

// Routes
app.get('/', (req, res) => {
    const today = new Date().toLocaleDateString(); // Get today's date as a string
    res.render('index', { tasks, today });
});

app.post('/', (req, res) => {
    const { name, taskDate, description } = req.body; // Modified: Use "taskDate" instead of "Date"
    const [year, month, day] = taskDate.split('-'); // Split the date string into year, month, and day
    const task = {
        name,
        date: new Date(year, month - 1, day), // Create a new Date object using the extracted values
        description,
    };
    tasks.push(task);
    res.redirect('/');
});

// Delete route
app.delete('/', (req, res) => {
    const taskIndex = req.body.taskIndex;
    tasks.splice(taskIndex, 1);
    res.redirect('/');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});