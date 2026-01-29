const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticate, authorize } = require('../middleware/auth');

//Info: Public routes - Anyone can access
router.get('/', bookController.getAll);
router.get('/:id', bookController.getOne);

//Info: Protected routes - Admin only
router.post('/', authenticate, authorize('admin'), bookController.create);
router.put('/:id', authenticate, authorize('admin'), bookController.update);
router.delete('/:id', authenticate, authorize('admin'), bookController.remove);

module.exports = router;