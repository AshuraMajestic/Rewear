
import ItemModel from '../models/ClothModel';
import UserModel from '../models/UserModel';
import SwapModel from '../models/SwapModel';

export const createItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = {
      user:        userId,
      title:       req.body.title,
      description: req.body.description,
      category:    req.body.category,
      type:        req.body.type,
      point:       req.body.point,
      size:        req.body.size,
      condition:   req.body.condition,
      images:      req.body.images,
    };

    const item = await ItemModel.create(data);
    res.status(201).json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all items, with optional status/category filters
export const getItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const items = await ItemModel.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single item by ID
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

// Get all items for the current user
export const getItemsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
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

// Update an existing item
export const updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const item = await ItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    if (item.user.toString() !== userId ) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    Object.assign(item, {
      title:       req.body.title,
      description: req.body.description,
      category:    req.body.category,
      type:        req.body.type,
      point:       req.body.point,
      size:        req.body.size,
      condition:   req.body.condition,
      images:      req.body.images,
    });

    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete an item
export const deleteItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const item = await ItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const user = await UserModel.findById(userId);
    if (item.user.toString() !== userId && !user) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await item.remove();
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const requestSwap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { offeredItemId, points } = req.body;
    const item = await ItemModel.findById(req.params.id);
    if (!item || item.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Item not available' });
    }

    if (points > 0) {
      const user = await UserModel.findById(userId);
      if (user.points < points) {
        return res.status(400).json({ success: false, message: 'Insufficient points' });
      }
      user.points -= points;
      await user.save();
    }

    const swap = await SwapModel.create({
      requester:      userId,
      owner:          item.user,
      itemRequested:  item._id,
      itemOffered:    offeredItemId || null,
      pointsUsed:     points || 0,
      status:         'requested'
    });

    item.status = 'pending';
    await item.save();

    res.status(201).json({ success: true, swap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
