import express from 'express'
import { protect,adminOnly } from '../middlewares/authMiddleware.js'
import { exportTask,exportUsersReport } from '../controllers/reportController.js'
const route = express.Router()

route.get('/export/task',protect,adminOnly,exportTask)
route.get('/export/user',protect,adminOnly,exportUsersReport)

export default route