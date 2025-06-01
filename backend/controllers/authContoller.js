import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/user.js'


const generateToken = (userID) =>{
    return jwt.sign({id:userID},process.env.ACCESS_TOKEN,{expiresIn:'7d'});
}

const userRegistration = async (req, res) => {
    try {
        const { Name, email, password, profileImageURL, adminIviteToken } = req.body;

        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }
        console.log('Invite token:', process.env.INVITE_TOKEN);

        let role = "member";
        if (adminIviteToken && adminIviteToken === 4588944) {
            role = "admin";
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await UserModel.create({
            Name,
            email,
            password: hashPassword,
            profileImageURL,
            role,
        });

        res.status(201).json({
            _id: newUser._id,
            Name: newUser.Name,
            email: newUser.email,
            profileImageURL: newUser.profileImageURL,
            role: newUser.role,
            token: generateToken(newUser._id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await UserModel.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: "Credential not found" });
        }

        const isMatchPassword = await bcrypt.compare(password, userExist.password);

        if (!isMatchPassword) {
            return res.status(400).json({ message: "Incorrect credentials" });
        }

        return res.status(200).json({
            _id: userExist._id,
            Name: userExist.Name,
            email: userExist.email,
            profileImageURL: userExist.profileImageURL,
            role: userExist.role,
            token: generateToken(userExist._id),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const userProfile = async (req,res) =>{
    try {
        const user = await UserModel.findById(req.user._id).select("-password")
        if(!user){
            return res.send(400).json({message:"UserNot found"})

        }
        res.json(user)

    } catch (error) {
        return res.send(500).json({message:"Server error"})
    }
}
const updateProfile = async (req, res) => {
  const { _id, email, Name, password, profileImageURL } = req.body;

  try {
    const user = await UserModel.findById(_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.Name = Name || user.Name;
    user.email = email || user.email;
    user.profileImageURL = profileImageURL || user.profileImageURL;

    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.json({
      _id: user._id,
      Name: user.Name,
      email: user.email,
      profileImageURL: user.profileImageURL,
      role: user.role,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export {userRegistration,userLogin,userProfile,updateProfile};