import express from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {getUser,getUserById,deleteuser} from "../controllers/userController.js"


const route = express.Router()

route.get('/',protect,adminOnly,getUser)
route.get('/:id',protect,getUserById)
route.delete('/:id',protect,deleteuser)

export default route