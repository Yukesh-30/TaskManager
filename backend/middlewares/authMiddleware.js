import jwt from 'jsonwebtoken';
import  UserModel  from '../models/user.js';

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
            req.user = await UserModel.findById(decoded.id).select("-password");
            next();
        } else {
            return res.status(401).json({ message: "Not Authorized" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const adminOnly = (req, res, next) => {
    try {
        const role = req.user.role;
        if (role && role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Only admin is allowed" });
        }
    } catch (error) {
        return res.status(403).json({ message: "Error in admin check" });
    }
};

export {protect,adminOnly}
