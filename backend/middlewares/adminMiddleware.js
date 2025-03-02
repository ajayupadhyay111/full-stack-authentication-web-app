import User from "../models/user.model.js";

export const adminMiddleware = async (request,response,next)=>{
    try {
        const email = request.email;
        const user = await User.findOne({email});
        if(user.role !== "admin"){
            return response.status(400).json({message:"You are eligible to access this page"});
        }
        next();
    } catch (error) {
        next(error);
    }
}