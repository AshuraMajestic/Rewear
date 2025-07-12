import express from 'express'
import { registerUser,loginUser, getprofile, updateProfile } from '../controller/usercontroller.js'
import  authUser  from '../middleware/authUser.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getprofile)
userRouter.post('/update-profile',authUser,updateProfile)

export default userRouter;