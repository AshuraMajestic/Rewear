import express from 'express'
import { createItem ,DeleteItem,UpdateItem,getItems,getItemById } from '../controller/clothcontroller.js'
import  authUser  from '../middleware/authUser.js'

const clothRouter = express.Router()

clothRouter.post('/add-item',authUser,createItem )
clothRouter.get('/get-items',getItems)
clothRouter.get('/get-items-user',authUser,getItemsByUser)
clothRouter.post('/get-item-by-id/:id',getItemById)
clothRouter.post('/delete-item/:id',authUser,DeleteItem)
clothRouter.put('/update-item/:id',authUser,UpdateItem)

export default clothRouter;