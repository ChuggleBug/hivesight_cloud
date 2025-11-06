import { configDotenv } from 'dotenv';
console.log('Configuring Environment...');
configDotenv();

import mongoose from 'mongoose';

import connectDB from './database/client.js'
import User from './database/schema.js'

console.log('Connecting to database');
if (!connectDB()) {
  console.log('Failed to connect to db');
  console.log('Exiting...');
  process.exit(1);
}
console.log('Connected to DB');

console.log("Resetting database...");

mongoose.connection.dropDatabase()
  .then(() => {
      console.log('Database dropped');
  })
  .catch(err => {
    console.log('Issue dropping database');
    process.exit(1);
  });
const test_users = [
  {
    username: 'user',
    password: 'password',
  },
  {
    username: 'alice',
    password: 'mypass',
  },
];


test_users.forEach(async (element) => {
  const user = new User({
    username: element.username, 
    password: element.password,
  });
  await user.save()

  const userFound = await User.findOne({ username: element.username });
    if (!user) {
      console.log("Failed to find ", element.username);
      return;
    }
    
    if (!await userFound.comparePassword(element.password)) {
      console.log("Password does not match the one in the database");
      return;
    }
    
    console.log(`User ${element.username} properly inserted!`);
});
