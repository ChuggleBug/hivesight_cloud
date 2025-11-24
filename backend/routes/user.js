import express from 'express'
import jwt from "jsonwebtoken";

import { User } from '../database/schema.js'

const userRoutes = express.Router();


async function generate_token(auth_json) {
  const token = jwt.sign({name: auth_json.username}, process.env.JWT_KEY, {
    expiresIn: '1d',
  });
  return token;
}

userRoutes.post('/login', async (req, res) => {
  const userauth = req.body;
  console.log(`User "${userauth.username}" attempting to login...`);

  // Validate user data
  const user = await User.findOne( { username: userauth.username } )

  if (user === null) {
    res.status(401).json( { error: `Invalid user "${userauth.username}"` } )
    return;
  }
  
  if (!await user.comparePassword(userauth.password)) {
    res.status(401).json( { error: "Invalid password" } )
    return;
  }

  console.log(`Generating token for "${userauth.username}"...`);
  const token = await generate_token({username: userauth.username});
  res.status(200).json( { token });
});

userRoutes.put('/create-account', async (req, res) => {
  const userauth = req.body;
  console.log(`Attempting to create user "${userauth.username}"...`);

  try {
    const user = new User({
      username: userauth.username, 
      password: userauth.password,
    });
    await user.save()
  }
  catch (error) {
    // Duplicate key (user of the username already exists)
    if (error.code === 11000) {
      res.status(409).json( {error: `"${userauth.username}" already exists!` });
      return;
    }
    res.status(500).json( {error: "Internal Server Error" });
    return;
  }

  console.log(`User "${userauth.username}" created!`);
  const token = await generate_token({username: userauth.username});
  res.status(200).json( { token } );
})

userRoutes.post("/validate", async (req, res) => {
  const { username, token } = req.body;  

  if (!token) {
    return res.status(400).json({ error: "Token missing" });
  }

  try {
    // Verify the old token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // (optional but recommended) ensure user still exists
    const user = await User.findOne({ username: decoded.name });
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    // Generate a brand new token
    const newToken = await generate_token({ username: decoded.name });


    return res.status(200).json({
      valid: true,
      token: newToken
    });

  } catch (err) {
    console.log(`User "${username}"'s token expired!`);
    return res.status(401).json({
      valid: false,
      error: err.message
    });
  }
});


export default userRoutes