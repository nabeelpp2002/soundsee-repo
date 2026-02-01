const userModel = require('../models/userModel');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // In a real app, hash the password here (e.g., using bcrypt)
        const newUser = await userModel.createUser(name, email, password);

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findUserByEmail(email);

        if (!user || user.password_hash !== password) { // TODO: Use bcrypt comparison
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
