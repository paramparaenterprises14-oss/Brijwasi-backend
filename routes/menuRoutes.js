const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controller/menuController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllMenuItems);
router.post('/', protect, adminOnly, createMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;