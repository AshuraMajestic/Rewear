import express from 'express'
import { createItem ,deleteItem,updateItem,getItems,getItemById,getItemsByUser } from '../controller/clothController.js'
import  authUser  from '../middleware/authUser.js'

const clothRouter = express.Router()

clothRouter.post('/add-item',authUser,createItem )
clothRouter.get('/get-items',getItems)
clothRouter.get('/get-items-user',authUser,getItemsByUser)
clothRouter.get('/get-item-by-id/:id',getItemById)
clothRouter.delete('/delete-item/:id',authUser,deleteItem)
clothRouter.put('/update-item/:id',authUser,updateItem)

export default clothRouter;