import express from 'express'
import jwt from "jsonwebtoken";
import { MongooseError } from 'mongoose';

import User from '../database/schema.js'

const userRoutes = express.Router();


async function generate_token(auth_json) {
  const token = jwt.sign({name: auth_json.username}, process.env.JWT_KEY, {
    expiresIn: '1d',
  });
  return token;
}

userRoutes.post('/login', async (req, res) => {
  const userauth = req.body;
  console.log(`User "${userauth.username}" attempting to login with "${userauth.password}"`)

  // Validate user data
  const user = await User.findOne( { username: userauth.username } )
  
  if (!user) {
    res.status(401).json( { error: `Invalid user "${userauth.username}"` } )
    return;
  }
  
  if (!await user.comparePassword(userauth.password)) {
    res.status(401).json( { error: "Invalid password" } )
    return;
  }

  const token = await generate_token({username: userauth.username});
  res.status(200).json( { token });
  console.log("Providing token: ", token);
});

userRoutes.put('/create-account', async (req, res) => {
  const userauth = req.body;
  console.log(`User "${userauth.username}" attempting to sign up with a password of "${userauth.password}"`)

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

  const token = await generate_token({username: userauth.username});
  res.status(200).json( { token } );
})

export default userRoutes