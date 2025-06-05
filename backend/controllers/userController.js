import UserModel from "../models/user.js"
import Task from "../models/task.js"
// import bcrypt from "bcrypt"

const getUser = async (req,res)=>{
    try {
        const user = await UserModel.find({role : "member"}).select("-password")

        const userTaskCount = await Promise.all(user.map(async (user)=>{
            const pendingTask = await Task.countDocuments({assignedTo:user._id,Status:"pending"})
            const inProgress = await Task.countDocuments({assignedTo:user._id,Status:"in progress"})
            const completed = await Task.countDocuments({assignedTo:user._id,Status:"completed"})

            return {
                ...user.toObject(),
                pendingTask,
                inProgress,
                completed
            }

        }))
        res.status(200).json({userTaskCount})
        
    } catch (error) {
        return res.send(500).json({message:"Server error"})
    }
}

const getUserById = async (req,res)=>{
    try {
        const user = await UserModel.findById({_id:req.params.id}).select("-password")
        if(!user){
            return res.status(400).json({message:"The member does not exist"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}
const deleteuser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(400).json({ message: "The member not found" });
        }

        await UserModel.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Deletion done" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const newUser = new UserModel({ username, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT: Update a user
const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    const user = await UserModel.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {getUser,getUserById,deleteuser,createUser,updateUser}