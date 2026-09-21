const express = require('express');
const userRouter = require('./router/userRouter');
const users = require('./data/users');

const app = express();
// Render provides the port through the PORT environment variable
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Escape user input before putting it into HTML
const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

// GET / - Main screen: shows all users and a form to add one
app.get('/', (req, res) => {
  const rows = users.map((user) => `
    <tr>
      <td>${user.id}</td>
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.email)}</td>
    </tr>`).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Users</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 16px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #f0f0f0; }
        input, button { padding: 8px; margin: 4px 0; width: 100%; box-sizing: border-box; }
        button { background: #333; color: white; border: none; cursor: pointer; }
        #error { color: red; }
      </style>
    </head>
    <body>
      <h1>Users</h1>
      <table>
        <tr><th>ID</th><th>Name</th><th>Email</th></tr>
        ${rows}
      </table>

      <h2>Add User</h2>
      <form id="userForm">
        <input id="name" placeholder="Name" required>
        <input id="email" type="email" placeholder="Email" required>
        <button type="submit">Add User</button>
        <p id="error"></p>
      </form>

      <script>
        document.getElementById('userForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: document.getElementById('name').value,
              email: document.getElementById('email').value
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
    </body>
    </html>
  `);
});

app.use('/api', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
