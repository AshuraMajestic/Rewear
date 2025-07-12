import jwt from 'jsonwebtoken';
import ItemModel from '../models/ClothModel.js';
import UserModel from '../models/UserModel.js';
import SwapModel from '../models/SwapModel.js';

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-default-secret';
    const adminEmail = process.env.ADMIN_EMAIL;

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Check if it's an admin token
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Admin privileges required'
      });
    }

    if (decoded.email !== adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Invalid admin'
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if credentials are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET || 'your-default-secret';
    
    // Check if environment variables are set
    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not found in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Validate credentials
    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: adminEmail,
        role: "admin"
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        email: adminEmail,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-default-secret';
    const adminEmail = process.env.ADMIN_EMAIL;

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.email !== adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Invalid admin'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const usersCount = await UserModel.countDocuments();

    const itemsCount = await ItemModel.countDocuments();

    const itemsExchanged = await SwapModel.countDocuments({ status: 'accepted' });

    const itemsRequested = await SwapModel.countDocuments();

    return res.json({
      success: true,
      data: {
        usersCount,
        itemsCount,
        itemsExchanged,
        itemsRequested
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // pull basic user info + count of their items
    const users = await UserModel.aggregate([
      {
        $lookup: {
          from: "items",         
          localField: "_id",
          foreignField: "user",
          as: "items",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          points: 1,
          createdAt: 1,
          updatedAt: 1,
          productCount: { $size: "$items" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // remove the user
    await user.deleteOne();

    await ItemModel.deleteMany({ user: id });
    await SwapModel.deleteMany({ $or: [{ requester: id }, { owner: id }] });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getAllItemsAdmin = async (req, res) => {
  try {
    const { search = '', status = 'all', page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(parseInt(page), 1);
    const perPage = Math.max(parseInt(limit), 1);

    // Build filter
    const filter = {};
    if (status !== 'all') filter.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      // join on owner name too -> we'll $lookup & $match below
      filter.$or = [
        { title: regex },
        { category: regex }
      ];
    }

    // Aggregation pipeline so we can match owner name
    const pipeline = [
      { $match: filter },
      // join owner
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'owner'
        }
      },
      { $unwind: '$owner' },
    ];

    // if search also on owner
    if (search) {
      const regex = new RegExp(search, 'i');
      pipeline.push({
        $match: {
          $or: [
            { title: regex },
            { category: regex },
            { 'owner.name': regex }
          ]
        }
      });
    }

    // count total
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await ItemModel.aggregate(countPipeline);
    const totalItems = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / perPage);

    // fetch page
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: (pageNum - 1) * perPage });
    pipeline.push({ $limit: perPage });

    // project only needed fields
    pipeline.push({
      $project: {
        title: 1,
        description: 1,
        category: 1,
        type: 1,
        size: 1,
        condition: 1,
        status: 1,
        views: 1,
        point: 1,
        images: 1,
        createdAt: 1,
        updatedAt: 1,
        'owner._id': 1,
        'owner.name': 1,
        'owner.email': 1
      }
    });

    const items = await ItemModel.aggregate(pipeline);

    res.json({
      success: true,
      items,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        itemsPerPage: perPage
      }
    });
  } catch (err) {
    console.error('Error fetching admin items:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


/**
 * DELETE /admin/items/:id
 * Permanently delete an item by its ID.
 */
export const deleteItemAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ItemModel.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
