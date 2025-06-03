import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {
    getTaskById,
    creatTask,
    getAllTasks,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTodoChecklist,
    getDashboardData,
    getUserDashboard
} from "../controllers/taskController.js";


const route = express.Router()
route.get('/dashboard',protect,getDashboardData)
route.get('/userdashboard',protect,getUserDashboard)
route.get('/',protect,getAllTasks)
route.get('/:id',protect,getTaskById)
route.post('/',protect,adminOnly,creatTask)
route.put('/:id',protect,adminOnly,updateTask)
route.delete('/:id',protect,adminOnly,deleteTask)
route.put('/:id/status',protect,updateTaskStatus)
route.put('/:id/todo',protect,updateTodoChecklist)



export default route
