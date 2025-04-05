const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// In-memory store for demo (replace with database in production)
let organizers = [];

const register = async (req, res) => {
    try {
        const { email, password, organizationName } = req.body;

        // Check if organizer already exists
        if (organizers.find(org => org.email === email)) {
            return res.status(400).json({ message: 'Organizer already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new organizer with UUID
        const organizer = {
            id: uuidv4(),
            email,
            password: hashedPassword,
            organizationName,
            createdAt: new Date()
        };

        organizers.push(organizer);

        // Generate JWT
        const token = jwt.sign(
            { id: organizer.id, email: organizer.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Organizer registered successfully',
            token,
            organizer: {
                id: organizer.id,
                email: organizer.email,
                organizationName: organizer.organizationName
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find organizer
        const organizer = organizers.find(org => org.email === email);
        if (!organizer) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, organizer.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: organizer.id, email: organizer.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            organizer: {
                id: organizer.id,
                email: organizer.email,
                organizationName: organizer.organizationName
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const organizer = organizers.find(org => org.id === req.organizerId);
        if (!organizer) {
            return res.status(404).json({ message: 'Organizer not found' });
        }

        res.status(200).json({
            id: organizer.id,
            email: organizer.email,
            organizationName: organizer.organizationName
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile
};