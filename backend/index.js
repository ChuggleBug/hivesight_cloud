import { configDotenv } from 'dotenv';
console.log('Configuring Environment...');
configDotenv();

import express from 'express'
import cors from 'cors'

import userRoutes from './routes/user.js';

import connectDB from './database/client.js'



console.log('Initializing express...');
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.LISTEN_PORT;

console.log('Connecting to database');
if (!connectDB()) {
  console.log('Failed to connect to db');
  console.log('Exiting...');
  process.exit(1);
}
console.log('Connected to DB');


// Allow requests from all sources
// TODO: This is bad
app.use(cors({
  origin: '*',
  credentials: true, // for cookies/caching
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

console.log('Adding user routes to /api/user...');
app.use('/api/user', userRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}...`);
});
