
import ItemModel from '../models/ClothModel.js';
import UserModel from '../models/UserModel.js';

export const createItem = async (req, res) => {
  try {
    const { userId } = req.user
    const userData = await UserModel.findById(userId).select('-password')

    if (!userData) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = {
      user: userId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      point: req.body.point,
      size: req.body.size,
      condition: req.body.condition,
      images: req.body.images,
    };

    const item = await ItemModel.create(data);
    res.status(201).json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getItems = async (req, res) => {
  try {
    const filter = { status: 'available' };


    if (req.query.category) {
      filter.category = req.query.category;
    }


    if (req.query.condition) {
      filter.condition = req.query.condition;
    }


    if (req.query.type) {
      filter.type = { $regex: req.query.type, $options: 'i' };
    }


    if (req.query.minPoints || req.query.maxPoints) {
      filter.point = {};
      if (req.query.minPoints) {
        filter.point.$gte = parseInt(req.query.minPoints);
      }
      if (req.query.maxPoints) {
        filter.point.$lte = parseInt(req.query.maxPoints);
      }
    }


    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }


    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sortObj = { [sortField]: sortOrder };


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;


    const items = await ItemModel.find(filter)
      .populate('user', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);


    const totalItems = await ItemModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      success: true,
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error in getItems:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const getItemById = async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id)
      .populate('user', 'name email');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getItemsByUser = async (req, res) => {
  try {
    const { userId } = req.user
    const userData = await UserModel.findById(userId).select('-password')

    if (!userData) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const items = await ItemModel.find({ user: userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const updateItem = async (req, res) => {
  try {
    const { userId } = req.user
    const userData = await UserModel.findById(userId).select('-password')

    if (!userData) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const item = await ItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    if (item.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    Object.assign(item, {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      point: req.body.point,
      size: req.body.size,
      condition: req.body.condition,
      images: req.body.images,
    });

    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const deleteItem = async (req, res) => {
  try {
    const { userId } = req.user
    const userData = await UserModel.findById(userId).select('-password')

    if (!userData) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const item = await ItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const user = await UserModel.findById(userId);
    if (item.user.toString() !== userId && !user) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const incrementItemViews = async (req, res) => {
  try {
    const { userId } = req.user;        // from protect middleware
    const { id } = req.params;

    // fetch the item to check ownership
    const item = await ItemModel.findById(id).select('user');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.user.toString() === userId) {
      return res.status(403).json({
        success: false,
        message: 'Owners cannot increment views on their own item'
      });
    }

    // now atomically increment
    const updated = await ItemModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, select: 'views' }
    );

    return res.json({
      success: true,
      message: 'View count incremented',
      views: updated.views
    });
  } catch (err) {
    console.error('Error incrementing item views:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};