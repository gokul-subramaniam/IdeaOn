const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const pool = require('./db');

const app = express();
app.use(express.json());

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const organizationsRouter = require('./routes/organizations');
app.use('/organizations', organizationsRouter);

const suggestionsRouter = require('./routes/suggestions');
app.use('/suggestions', suggestionsRouter);

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const flagsRouter = require('./routes/flags');
app.use('/flags', flagsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'IdeaOn API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});