const Menu = require('../models/Menu');

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const items = await Menu.find();
    res.json({ success: true, data: items, message: 'Menu items fetched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

// Create a new menu item
const createMenuItem = async (req, res) => {
  try {
    const newItem = await Menu.create(req.body);
    res.status(201).json({ success: true, data: newItem, message: 'Menu item created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

// Update a menu item
const updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ success: false, data: null, message: 'Item not found' });
    }
    res.json({ success: true, data: updatedItem, message: 'Menu item updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, data: null, message: 'Item not found' });
    }
    res.json({ success: true, data: deletedItem, message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

module.exports = { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };