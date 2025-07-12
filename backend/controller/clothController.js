import ItemModel from '../models/ClothModel'

export const createItem  = async(req,res)=>{
  try {
   const data = {
      user: req.user.id,
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
    res.json({success:true,item:item});
  }catch (error) {
    console.log(error);
    res.json({success : false, error : error.message})
  }
}

export const getItems  = async(req,res)=>{
  try {
   const filter = {};
    const items = await ItemModel.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({success:true,items:items});
  }catch (error) {
    console.log(error);
    res.json({success : false, error : error.message})
  }
}

export const getItemById  = async(req,res)=>{
  try {
    const item = await ItemModel.findById(req.params.id)
      .populate('user', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  }catch (error) {
    console.log(error);
    res.json({success : false, error : error.message})
  }
}
