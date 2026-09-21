const express = require('express');
const router = express.Router();
const { users } = require('../data/users');

// GET /api/users - Retrieve all users
router.get('/users', (req, res) => {
  res.status(200).json(users);
});

// POST /api/users - Create a user
router.post('/users', (req, res) => {
  const { name, email, age, city, course } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const user = { id: users.length + 1, name, email, age, city, course };
  users.push(user);

  res.status(201).json({
    message: 'User created successfully',
    user
  });
});

module.exports = router;
