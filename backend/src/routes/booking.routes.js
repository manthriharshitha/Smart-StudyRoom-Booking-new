const router = require('express').Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/booking.controller');

router.get('/', auth(['student', 'admin']), ctrl.list);
router.get('/:id', auth(['student', 'admin']), ctrl.getById);
router.post('/availability', auth(['student', 'admin']), ctrl.checkAvailability);
router.post('/', auth(['student', 'admin']), ctrl.create);
router.put('/:id', auth(['student', 'admin']), ctrl.update);
router.delete('/:id', auth(['student', 'admin']), ctrl.remove);

module.exports = router;


