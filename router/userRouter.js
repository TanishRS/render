const express = require('express');
const router = express.Router();
const users = require('../data/users');

router.get('/users', (req, res) => {
  res.status(200).json(users);
});

router.post('/users', (req, res) => {
  const { name, email } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const user = { id: users.length + 1, name, email };
  users.push(user);

  res.status(201).json({
    message: 'User created successfully',
    user
  });
});

module.exports = router;
