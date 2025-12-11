import express from 'express';
import fs from "fs/promises";
import path from "path";
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import multer from 'multer'

import { User, Video } from '../database/schema.js';
import mongoose from 'mongoose';

const videoRoutes = express.Router();

// Store file in memory temporarily
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 files allowed'), false);
    }
  }
});


async function generateThumbnailBuffer(inputPath) {
  if (!inputPath) throw new Error("Missing inputPath");

  const args = [
    "-ss", "00:00:01",
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
    if (user === null) {
      res.status(404).json({ error: "User not found" });
      return; 
    }

    const userVideos = await Video.find({ username }).sort({ creation_date: -1 });

    const videoPreviews = await Promise.all(
      userVideos.map(async (video) => {
        const videoPath = path.join(user.video_root, video.video_id);
        const buffer = await generateThumbnailBuffer(videoPath);
        return {
          video_id: video.video_id,
          thumbnail: buffer.toString("base64"),
          creation_date: video.creation_date,
        };
      })
    );

    res.status(200).json({ previews: videoPreviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

videoRoutes.get("/preview", async (req, res) => {
  const username = req.query.user;
  const video_id = req.query.video_id;

  const user = await User.findOne({ username });
  if (user === null) {
    res.status(404).json({ error: "User not found" })
    return;
  }

  const video = await Video.findOne({ username, video_id });
  if (video === null) {
    res.status(404).json({ error: "Video not found" });
    return;
  } 

  const videoPath = path.join(user.video_root, video_id);
  const buffer = await generateThumbnailBuffer(videoPath);

  const preview = {
    video_id: video.video_id,
    thumbnail: buffer.toString("base64"),
    creation_date: video.creation_date,
  };

  res.status(200).json(preview);
});

videoRoutes.get("/play", async (req, res) => {
  try {
    const username = req.query.user;
    const video_id = req.query.video_id;
    
    console.log(`${username} is requesting video ${video_id}`);
    
    const user = await User.findOne({ username });
    if (user === null) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const videoPath = path.join(user.video_root, video_id);

    // Verify video file exists
    try {
      await fs.access(videoPath);
    } catch {
      return res.status(404).json({ error: "Video file not found" });
    }

    // Stream support (allows seeking in player)
    const stat = await fs.stat(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for streaming
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = await fs.open(videoPath);
      const stream = file.createReadStream({ start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      stream.pipe(res);
    } else {
      // Send entire file if no range
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });

      const file = await fs.open(videoPath);
      file.createReadStream().pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

videoRoutes.delete('/delete', async (req, res) => {
  try {
    const username = req.query.user;
    const video_id = req.query.video_id;

    console.log("User requesting delete: ", {username, video_id});

    const user = await User.findOne( { username } );
    const video = await Video.findOne( { username, video_id } );

    if (user === null) {
      res.status(404).json( { error: "User not found" } );
      return;
    }

    if (video === null) {
      res.status(404).json( {error: "Video not found" } );
      return;
    }

    const video_path = `${user.video_root}/${video_id}`
    console.log('Deleting video at', video_path);

    await video.deleteOne();
    await fs.unlink(video_path);

    res.sendStatus(200);
  }
  catch (err) {
    console.log(err);
  }
});

videoRoutes.put('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const username = req.query.user;
    console.log(username)

    const user = await User.findOne({ username }); 

    if (user === null) {
      res.status(404).json( { error: "User not found" } );
      return;
    }

    const saveDir = user.video_root
    console.log(`Saving to ${saveDir}`)

    // Enter session to ensure that fs and db are in sync
    const session = await mongoose.startSession()

    // Create db entry
    const video = new Video( {
      username,
      creation_date: Date.now()
    });
    await video.save({ session });

    const filePath = path.join(saveDir, video.video_id);
    await fs.writeFile(filePath, req.file.buffer);

    session.endSession();

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  res.sendStatus(204)
});

export default videoRoutes;
