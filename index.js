require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');

const app = express();
connectDB();

// ✅ Middleware order matters
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// ✅ Session must come before routes
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// ✅ Make session user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', './views');

// Routes (after session is ready)
app.use('/', require('./routes/admin'));
app.use('/', require('./routes/events'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/bookings'));
app.use('/', require('./routes/enquiries'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
