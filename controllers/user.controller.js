import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/apiREsponse.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken =  async(userId) => {
    try {
      const user = await User.findById(userId)
      const accessToken =   user.generateAccessToken()
      const refreshToken =   user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save({validateBeforeSave: false})
      return {accessToken, refres1098525hToken}
    } catch (error) {
        throw new ApiErrors(500, "Something went wrong while generating the token")
    }
}

const registerUser = asyncHandler(async (req , res) => {
     const {fullname , username , email , password} = req.body
    if (
        [fullname , username , email , password].some((field)=> field?.trim() == "")
    ) {
        throw new ApiErrors(400, "All field are required")
    }

   const existedUser = await User.findOne({
        $or: [{ username } , { email }]
    }) 

    if(existedUser){
        throw new ApiErrors(409, "User with email or username already existed")
    }
   
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath =  req.files?.coverImage?.[0]?.path || null;

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   if(avatar){
    console.log("The avatar Image is successfull" )
   }else{
    console.log("The Avatar image upload is failed")
    throw new ApiErrors(400, "Avatar file uplad failed")
   }
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    

    if (!avatarLocalPath) {
        throw new ApiErrors(400 , "Avatar file is required")
    }

   if(!avatar){
    throw new ApiErrors(400 , "Avatar file is required")
   }

   const newUser = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || " ",
    email,
    password,
    username: username.toLowerCase()
   })

   const createdUser= await User.findById(newUser._id).select(
    "-password  -refernceToken "
   )

   if(!createdUser){
    throw new ApiErrors(500 , "Something went wrong while registering the user ")
   }

   return res.status(200).json(
    new ApiResponse(200, createdUser , "User Registered Successfully")
   )
})


const loginUser = asyncHandler(async (req , res) => {
    //req body -> data 
    //username or email
    //find the user
    //password check
    //access and refresh token  generation 
    //send them in cookies 
    console.log("🚀Login route hit in function!"); 
    const {email , username , password} = req.body
    if(!(username || email)){
        throw new ApiErrors(400 , "Username and email is required");
    }
   const user =  await User.findOne({
        $or:[{username}, {email}]
    })
    console.log("Find User:" , user)
    if(!user){
        throw new ApiErrors(404 , " Username not valid")
    }

    const ispasswordValid = await user.isPasswordCorrect(password)

if(!ispasswordValid){
    throw new ApiErrors(401, "Invalid uesr Credentials") 
}

const {accesToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

 const loggedinUser  = await User.findById(user._id).select("-password  -refreshToken")

 const options = {
    httpOnly: true ,
    secure: true ,
 }
 return res
 .status(200)
 .cookie("accessToken" , accesToken , options)
 .cookie("refreshToken" , refreshToken , options)
 .json(
    new ApiResponse(
        200,
        {
            user: loggedinUser, accesToken, refreshToken
        },
        "User logged in Successfully"
    )
 )
})



const logOutUser = asyncHandler(async(req , res) => {
    console.log("User Logout Route is called")
  await User.findByIdAndUpdate( req.user._id,{
    $set:{
        refreshToken: undefined
    }
   },
{
    new: true 
})

const options = {
    httpOnly: true ,
    secure: true ,
 }
 return res
 .status(200)
 .clearCookie("accessToken", options)
 .clearCookie("refreshToken", options)
 .json(new ApiResponse(200, {} , "User Logged Out"))
})
    
const genrefreshToken = asyncHandler(async(req, res) =>{
  const inComingTefreshToken =   req.cookies.refreshToken || req.body.refreshToken

  if(!inComingTefreshToken){
    throw new ApiErrors(401, "Unauhtoried");
  }
try {
    const decodedToken =  jwt.verify(
        inComingTefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      )
    
      const user = await User.findById(decodedToken?._id)
      if(!user){
        throw new ApiErrors(401, "Invalid Refresh Token");
      }
    
      if(inComingTefreshToken !== user?.refreshToken){
        throw new ApiErrors(401, "Refresh Token is Expired")
      }
    
      const options = {
        httpOnly: true,
        secure: true
      }
    
      const {accessToken, newRefreshToken}=  await generateAccessAndRefreshToken(user._id)
    
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken: newRefreshToken},
            "Accessed token refresh Successfully"
        )
      )
} catch (error) {
    throw new ApiErrors(401, error?.message || "Ivaldid Refresh Token main")
}

})

const changeCurrentUserPassword = asyncHandler(async(req,res) =>{
    const {oldPassword, newPassword} =  req.body ;

    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }
    
    const isPasswordCorrect = await  user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiErrors(400, "Invalid old Password")
    }
      user.password = newPassword;
      await user.save({validateBeforeSave: false})

      return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password Changed"))

}) 

const currentUser = asyncHandler((req, res) => {
    return res 
    .status(200)
    .json(200, req.user, "Current user Fetched Successfully")

})

const upadateAccountDetails = asyncHandler(async(req, res) => {
    
})

export {registerUser,
    loginUser,
    logOutUser,
    genrefreshToken,
    changeCurrentUserPassword,
    currentUser
}