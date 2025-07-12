import vaildator from 'validator'
import  bcrypt from 'bcrypt'
import userModel from '../models/UserModel.js'
import jwt from 'jsonwebtoken'


const registerUser = async(req,res)=>{
  try {
    const {name,email, password} = req.body

    if (!name || !email || !password) {
  return res.json({success : false, message : "Missing details"})      
    }
    

    if (!vaildator.isEmail(email)) {
      return res.json({success : false, message : "Enter a vaild email"})      
    }

    if (password.length <0) {
      return res.json({success : false, message : "Enter a strong password"})      
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const userData = {
      name, 
      email,
      password : hashedPassword,
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()
   
     const token = jwt.sign({id: user._id},process.env.JWT_SECRET)

     res.json({success : true, token })
    
    
  }catch (error) {
    console.log(error);
    res.json({success : false, error : error.message})
  }
}

const loginUser = async(req,res)=>{
  try {
    const {email,password} = req.body;
    const user = await userModel.findOne({email })
    if (!user) {

      res.json({success : false,message : 'User does not exist' })
    }
  const isMatch = await bcrypt.compare(password,user.password)

  if (isMatch) {
    const token = jwt.sign({id : user._id},process.env.JWT_SECRET)
    res.json({success : true, token})
  }else{
    res.json({success : false, message : 'Invaild credentails'})
  }
  } catch (error) {
    console.log(error);
    res.json({success : false,message : error.message })
  }
}


const getprofile = async(req, res) => {
  try {
    const {userId} = req.user
    const userData = await userModel.findById(userId).select('-password')
    res.json({success: true, userData})
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message})
  }
}


const updateProfile = async(req,res)=>{
  try {
    const {userId,name,points} = req.body

    
    await userModel.findByIdAndUpdate(userId,{name,points})

    
    res.json({success : true,  message : 'Profile Updated'})

  } catch (error) {
    console.log(error);
    res.json({success : false,message : error.message })
  }
}


export {registerUser,loginUser,getprofile, updateProfile }