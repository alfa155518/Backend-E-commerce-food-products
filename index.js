const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const rateLimit = require('express-rate-limit');
const userRoute = require('./routes/userRoutes');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
require('dotenv').config();

let port = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in 15 minutes',
});

// Cors middleWare
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Limit the number of requests
app.use(limiter);

// Configure  handlers for all requests and responses
app.use(mongoSanitize());

//  Handle Requests Headers
app.use(helmet());

// Run the Static Fils
app.use(express.static(path.join(__dirname, './images')));

mongoose
  .connect(process.env.MONGO_DB_PASSWORD)
  .then(() => console.log('Connected to MongoDB'));

// User Routes Middleware
app.use('/api/v1/users', userRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
