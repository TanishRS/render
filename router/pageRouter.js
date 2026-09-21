const express = require('express');
const router = express.Router();
const { users, toSlug } = require('../data/users');

// Escape user input before putting it into HTML
const escapeHtml = (text) =>
  String(text ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

const layout = (title, body) => `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 16px; }
      ul { padding: 0; list-style: none; }
      li a { display: block; padding: 12px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 6px; color: #333; text-decoration: none; }
      li a:hover { background: #f0f0f0; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background: #f0f0f0; width: 30%; }
      input, button { padding: 8px; margin: 4px 0; width: 100%; box-sizing: border-box; }
      button { background: #333; color: white; border: none; cursor: pointer; }
      #error { color: red; }
    </style>
  </head>
  <body>${body}</body>
  </html>
`;

// GET / - Main page: shows only the names, each linking to its own page
router.get('/', (req, res) => {
  const list = users.map((user) => `
    <li><a href="/${encodeURIComponent(toSlug(user.name))}">${escapeHtml(user.name)}</a></li>`).join('');

  res.send(layout('Users', `
    <h1>Users</h1>
    <ul>${list}</ul>

    <h2>Add User</h2>
    <form id="userForm">
      <input id="name" placeholder="Name" required>
      <input id="email" type="email" placeholder="Email" required>
      <input id="age" type="number" placeholder="Age">
      <input id="city" placeholder="City">
      <input id="course" placeholder="Course">
      <button type="submit">Add User</button>
      <p id="error"></p>
    </form>

    <script>
      document.getElementById('userForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const value = (id) => document.getElementById(id).value;
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: value('name'),
            email: value('email'),
            age: value('age'),
            city: value('city'),
            course: value('course')
          })
        });
        if (res.ok) {
          location.reload();
        } else {
          const data = await res.json();
          document.getElementById('error').textContent = data.error;
        }
      });
    </script>
  `));
});

// GET /:name - Dedicated page with the full details of one user
router.get('/:name', (req, res) => {
  const user = users.find((u) => toSlug(u.name) === req.params.name.toLowerCase());

  if (!user) {
    return res.status(404).send(layout('Not found', `
      <h1>User not found</h1>
      <a href="/">&larr; Back to all users</a>
    `));
  }

  res.send(layout(escapeHtml(user.name), `
    <h1>${escapeHtml(user.name)}</h1>
    <table>
      <tr><th>ID</th><td>${user.id}</td></tr>
      <tr><th>Email</th><td>${escapeHtml(user.email)}</td></tr>
      <tr><th>Age</th><td>${escapeHtml(user.age)}</td></tr>
      <tr><th>City</th><td>${escapeHtml(user.city)}</td></tr>
      <tr><th>Course</th><td>${escapeHtml(user.course)}</td></tr>
    </table>
    <a href="/">&larr; Back to all users</a>
  `));
});

module.exports = router;
