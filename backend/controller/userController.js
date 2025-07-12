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
    await newUser.save()

     res.json({success : true })
    
    
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

const POINTS_PACKAGES = {
  starter: {
    id: 'starter',
    rupees: 99,
    points: 100,
    bonus: 0
  },
  basic: {
    id: 'basic',
    rupees: 199,
    points: 220,
    bonus: 20
  },
  premium: {
    id: 'premium',
    rupees: 499,
    points: 600,
    bonus: 100
  },
  mega: {
    id: 'mega',
    rupees: 999,
    points: 1300,
    bonus: 300
  },
  ultimate: {
    id: 'ultimate',
    rupees: 1999,
    points: 2800,
    bonus: 800
  }
};

const addPoints = async (req, res) => {
  try {
    const { userId } = req.user;
    const { packageId, rupees, points } = req.body;

    // Validate required fields
    if (!packageId || !rupees || !points) {
      return res.json({
        success: false,
        message: 'Package ID, rupees, and points are required'
      });
    }

    // Validate package exists
    const packageData = POINTS_PACKAGES[packageId];
    if (!packageData) {
      return res.json({
        success: false,
        message: 'Invalid package selected'
      });
    }

    // Validate package data matches
    if (packageData.rupees !== rupees || packageData.points !== points) {
      return res.json({
        success: false,
        message: 'Package data mismatch'
      });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate new points balance
    const pointsToAdd = packageData.points;
    const newBalance = user.points + pointsToAdd;

    // Update user points
    await userModel.findByIdAndUpdate(userId, {
      points: newBalance,
      $push: {
        pointsHistory: {
          type: 'purchase',
          amount: packageData.rupees,
          points: pointsToAdd,
          packageId: packageId,
          timestamp: new Date(),
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      }
    });


    res.json({
      success: true,
      message: `Successfully added ${pointsToAdd} points to your account`,
      data: {
        pointsAdded: pointsToAdd,
        newBalance: newBalance,
        transaction: {
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          packageId: packageId,
          amount: packageData.rupees,
          points: pointsToAdd,
          bonus: packageData.bonus,
          timestamp: new Date()
        }
      }
    });

  } catch (error) {
    console.error('Error adding points:', error);
    res.json({
      success: false,
      message: 'Failed to add points. Please try again.'
    });
  }
};

export {registerUser,loginUser,getprofile, updateProfile, addPoints }