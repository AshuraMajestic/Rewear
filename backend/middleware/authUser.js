import jwt from 'jsonwebtoken'

// Admin authentication middlware
const authUser = async(req, res, next) => {
  try {
 
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({success: false, message: "Not Authorized Login Again"})
    }
    
    // Extract the token from "Bearer TOKEN"
    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return res.json({success: false, message: "Not Authorized Login Again"})
    }
    
    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    
    // Set userId in req.user instead of req.body - this is cleaner
    req.user = { userId: token_decode.id }
    
    next()
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}
 export default authUser;