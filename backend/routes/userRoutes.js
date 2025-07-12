import express from 'express'
import { registerUser,loginUser, getprofile, updateProfile, addPoints } from '../controller/userController.js'
import  authUser  from '../middleware/authUser.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getprofile)
userRouter.post('/update-profile',authUser,updateProfile)
userRouter.post('/add-points',authUser,addPoints)

export default userRouter;