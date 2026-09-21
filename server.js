const express = require('express');
const userRouter = require('./router/userRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running on Render!');
});

app.use('/api', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
