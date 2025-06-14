import Task from '../models/task.js'
import UserModel from '../models/user.js'

const getTaskById = async (req,res) => {
    try {
       const id = req.params.id
       const task = await Task.find({"_id":id}).populate(
        "assignedTo","Name email profileImageURL"
       ) 
       if(!task){
        return res.status(400).json({message:"Task Not found"})
       }
       res.status(201).json(task)
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

const creatTask = async (req,res) =>{
    try {
        const {title,description,priority,dueDate,assignedTo,attachments,todoCheckList} = req.body;
        if(!Array.isArray(assignedTo)){
            return res.status(400).json({
                message:"The assigned to should be Array of ids"
            })
        }
        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy : req.user._id,
            todoCheckList,
            attachments
        })
        return res.status(201).json({message:
            "Task created successfully",task
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"})
    }
}
const getAllTasks = async (req, res) => {
  try {
    let filter = {}

    if (req.user.role === 'admin') {
      // Admin: show only tasks created by this admin
      filter.createdBy = req.user._id
    } else{
      // Member: show only tasks assigned to them
      filter.assignedTo = req.user.email
    }

    const tasks = await Task.find(filter).populate('assignedTo', 'name email profileURL')

    res.status(200).json(tasks)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}



const updateTask = async (req,res) =>{
    const id = req.params.id
    try {
        const task = await Task.findById(id)
        if(!task){
            return res.status(401).json({message:"Task not found"})
        }
        if (req.body.assignedTo && !Array.isArray(req.body.assignedTo)) {
            return res.status(400).json({ message: "The assignment should be an array of member IDs" });
        }
        task.title = req.body.title || task.title
        task.description = req.body.description || task.description
        task.priority = req.body.priority || task.priority
        task.dueDate = req.body.dueDate || task.dueDate
        task.Status = req.body.Status || task.Status
        task.assignedTo = req.body.assignedTo || task.assignedTo
        task.attachments = req.body.attachments || task.attachments
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList

        
        const updatedTask = await task.save()
        return res.status(200).json(updatedTask)

    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

const deleteTask = async (req,res) =>{
    try {
        const id = req.params.id
        const task = await Task.findById(id)
        if(!task){
            return res.status(400).json({message:"User not found"})
        }
        await Task.deleteOne({"_id":id})
         return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        return res.status(500).json({message:"Server error"})
    }
}

const updateTaskStatus = async (req,res) =>{
    try {
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(400).json({message:"The task not found"})

        }

        const isAssignedTo = task.assignedTo.some(
            (userId) =>{
                return userId.toString() === req.user._id.toString() 
            }
        )

        if(!isAssignedTo && req.user.role!=="admin"){
            return res.status(403).json({message:"Not authorized"})
        }
        task.Status = req.body.Status || task.Status
        if(task.Status==="completed"){
            task.todoCheckList.forEach((element) => {element.completed =true});
            task.progress =100;
        }
        await task.save()
        return res.status(200).json({message:"Task status updated successfully"})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:"Server error"})
    }
}
const updateTodoChecklist = async (req, res) => {
    try {
        const id = req.params.id; // Task ID from URL
        const { todoCheckList } = req.body; // New todo checklist array

        // Validation
        if (!Array.isArray(todoCheckList)) {
            return res.status(400).json({ message: "todoCheckList must be an array" });
        }

        // Optional: validate structure of each todo item
        for (const item of todoCheckList) {
            if (typeof item.text !== 'string' || typeof item.completed !== 'boolean') {
                return res.status(400).json({ message: "Each todo item must have 'text' (string) and 'completed' (boolean)" });
            }
        }

        // Update only the todoCheckList field
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { todoCheckList },
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json({ message: "Checklist updated", task: updatedTask });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getDashboardData = async (req, res) => {
  try {
    
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ Status: "pending" });
    const completedTasks = await Task.countDocuments({ Status: "completed" });
    const overdueTasks = await Task.countDocuments({
      Status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    });

    // Task status distribution
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); // Remove spaces for keys
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // You can add recentTasks logic if needed
    const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(5);

    // Final response
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const userEmail = req.body.email
    const userId = req.body._id
    

    // Fetch statistics
    
    const totalTasks = await Task.countDocuments({ assignedTo: userEmail});
    
    const pendingTasks = await Task.countDocuments({ assignedTo: userEmail, Status: "pending" });
    const completedTasks = await Task.countDocuments({ assignedTo: userEmail, Status: "completed" });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userEmail,
      Status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // Task distribution by status
    const taskStatuses = ["Pending", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    // Task distribution by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Recent tasks
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    // Send response
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




export {getTaskById,creatTask,getAllTasks,updateTask,deleteTask,updateTaskStatus,updateTodoChecklist,getDashboardData,getUserDashboard}