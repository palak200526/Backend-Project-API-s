// Import required modules
const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// In-memory storage
let furniture = [];
let users = [];


// Get all furniture
app.get('/furniture', (req, res) => {
    res.json(furniture);
});

// Get a specific furniture item by ID
app.get('/furniture/:id', (req, res) => {
    const item = furniture.find(f => f.id == req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Furniture not found' });
});

// Add a new furniture item
app.post('/furniture', (req, res) => {
    const { id, name, price, category, imageUrl } = req.query;  // Added imageUrl
    if (!id || !name || !price || !category || !imageUrl) {
        return res.status(400).json({ error: 'Missing parameters' });
    }
    furniture.push({ id: Number(id), name, price: Number(price), category, imageUrl });
    res.status(201).json({ message: 'Furniture added via query params' });
});

// Update a furniture item
app.put('/furniture/:id', (req, res) => {
    const item = furniture.find(f => f.id == req.params.id);
    if (!item) return res.status(404).json({ error: 'Furniture not found' });
    
    Object.assign(item, req.body);
    res.json({ message: 'Furniture updated' });
});

// Delete a furniture item
app.delete('/furniture/:id', (req, res) => {
    furniture = furniture.filter(f => f.id != req.params.id);
    res.json({ message: 'Furniture deleted' });
});

// 1️⃣ **Get All Users**
app.get('/users', (req, res) => {
    res.json(users);
});

// 2️⃣ **Get User by ID**
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// 3️⃣ **Add a New User**
app.post('/users', (req, res) => {
    const { id, name, email } = req.body;
    if (!id || !name || !email) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    // Check if user already exists
    if (users.some(u => u.id === Number(id))) {
        return res.status(400).json({ error: 'User already exists' });
    }

    users.push({ id: Number(id), name, email });
    res.status(201).json({ message: 'User added successfully' });
});

// 4️⃣ **Update an Existing User**
app.put('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    // Update user properties
    const { name, email } = req.body;
    if (name) users[index].name = name;
    if (email) users[index].email = email;

    res.json({ message: 'User updated successfully', user: users[index] });
});

// 5️⃣ **Delete a User**
app.delete('/users/:id', (req, res) => {
    const initialLength = users.length;
    users = users.filter(u => u.id !== Number(req.params.id));

    if (users.length === initialLength) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
