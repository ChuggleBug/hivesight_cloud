import express from 'express';
import fs from "fs/promises";
import path from "path";
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

import { User, Video } from '../database/schema.js';

const videoRoutes = express.Router();


async function generateThumbnailBuffer(inputPath) {
  if (!inputPath) throw new Error("Missing inputPath");

  const args = [
    "-ss", "00:00:01",           // hardcoded timestamp
    "-i", inputPath,
    "-frames:v", "1",
    "-q:v", "2",
    "-vf", "scale=600:-1",
    "-f", "image2",
    "-vcodec", "mjpeg",
    "-"
  ];

  return new Promise((resolve, reject) => {
    const ff = spawn(ffmpegPath, args, { stdio: ["ignore", "pipe", "pipe"] });

    const chunks = [];
    let stderr = "";

    ff.stdout.on("data", (c) => chunks.push(c));
    ff.stderr.on("data", (c) => (stderr += c.toString()));

    ff.on("error", reject);
    ff.on("close", (code) => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(0, 200)}`));
    });
  });
}

videoRoutes.get("/previews", async (req, res) => {
  try {
    const username = req.query.user;
    console.log(`${username} requesting video previews`);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get all video entries associated with a user in 
    // descending order by creation date
    const userVideos = await Video.find( { username } ).sort( { creation_date: -1 } )

    const videoPreviews = await Promise.all(userVideos.map(async (video) => {
      // Construct video root based on user collection
      const videoPath = `${user.video_root}/${video.video_id}`
      const buffer = await generateThumbnailBuffer(videoPath);
      return {
        video_id: video.video_id,
        thumbnail: buffer.toString("base64"),
        creation_date: video.creation_date,
      };
    }));
    res.status(200).json( { previews: videoPreviews } );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


export default videoRoutes