const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes - anyone can access
router.get('/', authorController.getAll);
router.get('/:id', authorController.getOne);

// Protected routes - Admin only
router.post('/', authenticate, authorize('admin'), authorController.create);
router.put('/:id', authenticate, authorize('admin'), authorController.update);
router.delete('/:id', authenticate, authorize('admin'), authorController.remove);

module.exports = router;

