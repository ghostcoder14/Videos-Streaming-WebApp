import { ApiErrors } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";

export const verifyJWT  = asyncHandler(async(req , res , next) => {
   try {
    const token =  req.cookies?.accesToken || req.header
     ("Authorization")?.replace("Bearer" , "")
 
     if(!token){
         throw new ApiErrors(401, "Unathroised request")
     }
 
    const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)
    .select("-password -refreshToken ")
 
    if(!User){
     throw new ApiErrors(401, "Invalid Access Token")
    }
 
    req.user = user ;
    next()
   } catch (error) {
    throw new ApiErrors(401, "Invalid access token")
   }

})