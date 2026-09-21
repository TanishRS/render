const express = require('express');
const userRouter = require('./router/userRouter');
const pageRouter = require('./router/pageRouter');

const app = express();
// Render provides the port through the PORT environment variable
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes (JSON) - mounted first so /api isn't treated as a user name
app.use('/api', userRouter);

// Web pages - main page (/) and each user's page (/:name)
app.use('/', pageRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
