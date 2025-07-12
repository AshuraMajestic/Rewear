import express from 'express'
import { createItem ,DeleteItem,UpdateItem,getItems } from '../controller/clothcontroller.js'
import  authUser  from '../middleware/authUser.js'

const clothRouter = express.Router()

userRouter.post('/add-item',authUser,createItem )
userRouter.post('/get-items',getItems)
userRouter.post('/get-items-user',authUser,getItemsByUser)
userRouter.post('/delete-item',authUser,DeleteItem)
userRouter.post('/update-item',authUser,UpdateItem)

export default clothRouter;