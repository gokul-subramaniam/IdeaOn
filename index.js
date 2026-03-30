const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const pool = require('./db');

const app = express();
app.use(express.json());

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.json({ message: 'IdeaOn API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});