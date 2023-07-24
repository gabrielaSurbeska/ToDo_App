import express from 'express';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Override method middleware
app.use((req: { body: { _method: any; }; method: any; }, res: any, next: () => void) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
});

// Mock tasks array
let tasks: any[];
tasks = [];

// Routes
app.get('/', (req: any, res: { render: (arg0: string, arg1: { tasks: any[]; today: string; }) => void; }) => {
    const today = new Date().toLocaleDateString(); // Get today's date as a string
    res.render('index', { tasks, today });
});

app.post('/', (req: { body: { name: any; taskDate: any; description: any; }; }, res: { redirect: (arg0: string) => void; }) => {
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
app.delete('/', (req: { body: { taskIndex: any; }; }, res: { redirect: (arg0: string) => void; }) => {
    const taskIndex = req.body.taskIndex;
    tasks.splice(taskIndex, 1);
    res.redirect('/');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});