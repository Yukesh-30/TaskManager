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


export {getUser,getUserById,deleteuser}