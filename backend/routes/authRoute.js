import express from 'express'
import { protect } from '../middlewares/authMiddleware.js';
import {userRegistration,userLogin,userProfile,updateProfile} from '../controllers/authContoller.js';
import upload from '../middlewares/uploadMiddleware.js';



const route = express.Router()

route.post('/register',userRegistration);
route.post('/login',userLogin);
route.get('/getProfile',protect,userProfile);
route.put('/updateprofile',protect,updateProfile);

route.post('/uploadimage', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        return res.status(200).json({ fileURL });
    });
});

export default route;