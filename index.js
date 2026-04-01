const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const pool = require('./db');

const app = express();
app.use(cors());
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

const pinnedRouter = require('./routes/pinned');
app.use('/pinned', pinnedRouter);

const notificationsRouter = require('./routes/notifications');
app.use('/notifications', notificationsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'IdeaOn API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

