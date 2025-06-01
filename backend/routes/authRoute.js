import express from 'express'
import { protect } from '../middlewares/authMiddleware.js';
import {userRegistration,userLogin,userProfile,updateProfile} from '../controllers/authContoller.js';


const route = express.Router()

route.post('/register',userRegistration);
route.post('/login',userLogin);
route.get('/getProfile',protect,userProfile);
route.put('/updateprofile',protect,updateProfile);

export default route;