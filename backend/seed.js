import { configDotenv } from 'dotenv';
console.log('Configuring Environment...');
configDotenv();

import mongoose from 'mongoose';
import fs from 'fs'

import connectDB from './database/client.js'
import { User, Video } from './database/schema.js'

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

// Need to created
const test_user_videos = [
  {
    username: 'user',
    video_id: 1,
    creation_date: new Date(1723905120 * 1000), // 2024-08-17T14:32:00Z
  },
  {
    username: 'user',
    video_id: 2,
    creation_date: new Date(1741089300 * 1000), // 2025-03-04T09:15:00Z
  },
];
// Creating videos 
fs.mkdirSync(`${process.env.VIDEO_ROOT_DIR}/video/user`, { recursive: true });
test_user_videos.forEach(user_video => {
  const video = new Video(user_video);
  video.save();
  fs.copyFileSync(`${process.env.VIDEO_ROOT_DIR}/${video.video_id}`, `${process.env.VIDEO_ROOT_DIR}/video/user/${video.video_id}`);
});

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

