const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { authenticate, authorize } = require('../middleware/auth');

//Info: Public routes - Anyone can access
router.get('/', journalController.getAll);
router.get('/:id', journalController.getOne);

//Info: Protected routes - Admin only
router.post('/', authenticate, authorize('admin'), journalController.create);
router.put('/:id', authenticate, authorize('admin'), journalController.update);
router.delete('/:id', authenticate, authorize('admin'), journalController.remove);

module.exports = router;