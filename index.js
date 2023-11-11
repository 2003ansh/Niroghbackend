const connectToMongo = require('./db');
const express = require('express')
const helmet = require('helmet'); // Import helmet
const cors = require('cors'); // Import the cors middleware
const dotenv=require("dotenv")
dotenv.config();
connectToMongo();
const app = express()
const port = process.env.PORT || 5000
// Enable JSON body parsing middleware
app.use(express.json({limit: '50mb'}));

// Use Helmet middleware for enhanced security headers
app.use(helmet());

// Enable CORS middleware (if needed)
app.use(cors());

//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/services', require('./routes/features'))
app.use('/api/testimonials', require('./routes/testimonial'))
app.use('/api/photos', require('./routes/photos'))
app.use('/api/videos', require('./routes/video'))
app.use('/api/notices', require('./routes/notice'))


app.listen(port, () => {
    console.log(`Nirogh backend listening at http://localhost:${port}`)
  })