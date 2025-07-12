import ItemModel from '../models/ClothModel.js';
import UserModel from '../models/UserModel.js';
import SwapModel from '../models/SwapModel.js';

// Create swap request
export const createSwapRequest = async (req, res) => {
  try {
    const { userId } = req.user
    const { owner, itemRequested, itemOffered, pointsUsed, message, swapType } = req.body;

    if (!owner || !itemRequested) {
      return res.status(400).json({ 
        success: false, 
        message: 'Owner and requested item are required' 
      });
    }

    if (!['item', 'points', 'hybrid'].includes(swapType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid swap type' 
      });
    }

    if (userId === owner) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot swap with yourself' 
      });
    }

    const requestedItem = await ItemModel.findById(itemRequested);
    if (!requestedItem || requestedItem.status !== 'available') {
      return res.status(400).json({ 
        success: false, 
        message: 'Requested item is not available' 
      });
    }

    if (requestedItem.user.toString() !== owner) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item does not belong to the specified owner' 
      });
    }

    const requester = await UserModel.findById(userId);
    if (!requester) {
      return res.status(400).json({ 
        success: false, 
        message: 'Requester not found' 
      });
    }

    if (pointsUsed > 0) {
      if (requester.points < pointsUsed) {
        return res.status(400).json({ 
          success: false, 
          message: 'Insufficient points' 
        });
      }
    }


    let offeredItem = null;
    if (itemOffered) {
      offeredItem = await ItemModel.findById(itemOffered);
      if (!offeredItem || offeredItem.status !== 'available') {
        return res.status(400).json({ 
          success: false, 
          message: 'Offered item is not available' 
        });
      }

      if (offeredItem.user.toString() !== userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'You can only offer items you own' 
        });
      }
    }

    if (swapType === 'item' && !itemOffered) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item swap requires an offered item' 
      });
    }

    if (swapType === 'points' && pointsUsed <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Points swap requires points to be used' 
      });
    }

    if (swapType === 'hybrid' && (!itemOffered || pointsUsed <= 0)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hybrid swap requires both an item and points' 
      });
    }

    const existingSwap = await SwapModel.findOne({
      requester: userId,
      owner: owner,
      itemRequested: itemRequested,
      status: 'requested'
    });

    if (existingSwap) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a pending swap request for this item' 
      });
    }

    const swapData = {
      requester: userId,
      owner: owner,
      itemRequested: itemRequested,
      itemOffered: itemOffered || null,
      pointsUsed: pointsUsed || 0,
      message: message || '',
      swapType: swapType,
      status: 'requested'
    };

    const swap = await SwapModel.create(swapData);
    if (pointsUsed > 0) {
     requester.points = (requester.points || 0) - pointsUsed;
     await requester.save();
  }

    // If offered item exists, optionally update its status too
    if (offeredItem) {
      offeredItem.status = 'pending';
      await offeredItem.save();
    }

    // Populate the swap with user and item details for response
    const populatedSwap = await SwapModel.findById(swap._id)
      .populate('requester', 'name email')
      .populate('owner', 'name email')
      .populate('itemRequested', 'title images point')
      .populate('itemOffered', 'title images point');

    res.status(201).json({ 
      success: true, 
      message: 'Swap request created successfully',
      swap: populatedSwap 
    });

  } catch (error) {
    console.error('Error creating swap request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get swap requests for a user (received)
export const getReceivedSwapRequests = async (req, res) => {
  try {
     const { userId } = req.user
    
    const swaps = await SwapModel.find({ owner: userId })
      .populate('requester', 'name email')
      .populate('itemRequested', 'title images point')
      .populate('itemOffered', 'title images point')
      .sort({ createdAt: -1 });

    res.json({ success: true, swaps });
  } catch (error) {
    console.error('Error getting received swap requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get swap requests made by a user (sent)
export const getSentSwapRequests = async (req, res) => {
  try {
     const { userId } = req.user
    
    const swaps = await SwapModel.find({ requester: userId })
      .populate('owner', 'name email')
      .populate('itemRequested', 'title images point')
      .populate('itemOffered', 'title images point')
      .sort({ createdAt: -1 });

    res.json({ success: true, swaps });
  } catch (error) {
    console.error('Error getting sent swap requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Accept swap request
export const acceptSwapRequest = async (req, res) => {
  try {
    const { userId } = req.user;
    const { swapId } = req.params;

    const swap = await SwapModel.findById(swapId);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }
    if (swap.owner.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'You can only accept your own swap requests' });
    }
    if (swap.status !== 'requested') {
      return res.status(400).json({ success: false, message: 'Swap request is no longer pending' });
    }

    // mark swap as accepted
    swap.status = 'accepted';
    await swap.save();

    // Update requested item → exchanged
    const requestedItem = await ItemModel.findById(swap.itemRequested);
    if (requestedItem) {
      requestedItem.status = 'exchanged';
      await requestedItem.save();
    }

    // Update offered item → exchanged
    if (swap.itemOffered) {
      const offeredItem = await ItemModel.findById(swap.itemOffered);
      if (offeredItem) {
        offeredItem.status = 'exchanged';
        await offeredItem.save();
      }
    }

    // Credit owner with any points used by requester
    if (swap.pointsUsed > 0) {
      const ownerUser = await UserModel.findById(swap.owner);
      if (ownerUser) {
        ownerUser.points = (ownerUser.points || 0) + swap.pointsUsed;
        await ownerUser.save();
      }
    }

    res.json({
      success: true,
      message: 'Swap request accepted successfully',
      swap
    });

  } catch (error) {
    console.error('Error accepting swap request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


// Decline swap request
export const declineSwapRequest = async (req, res) => {
  try {
    const { userId } = req.user;
    const { swapId } = req.params;

    const swap = await SwapModel.findById(swapId);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap request not found' });
    }
    if (swap.owner.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'You can only decline your own swap requests' });
    }
    if (swap.status !== 'requested') {
      return res.status(400).json({ success: false, message: 'Swap request is no longer pending' });
    }

    // mark swap as declined
    swap.status = 'declined';
    await swap.save();

    // Refund points if any were used
    if (swap.pointsUsed > 0) {
      const requester = await UserModel.findById(swap.requester);
      if (requester) {
        requester.points += swap.pointsUsed;
        await requester.save();
      }
    }

    // If an offered item was held pending, make it available again
    if (swap.itemOffered) {
      const offeredItem = await ItemModel.findById(swap.itemOffered);
      if (offeredItem) {
        offeredItem.status = 'available';
        await offeredItem.save();
      }
    }

    res.json({
      success: true,
      message: 'Swap request declined successfully',
      swap
    });

  } catch (error) {
    console.error('Error declining swap request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
