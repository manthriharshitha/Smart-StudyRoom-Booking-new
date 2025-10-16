const router = require('express').Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/room.controller');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', auth(['admin']), ctrl.create);
router.put('/:id', auth(['admin']), ctrl.update);
router.delete('/:id', auth(['admin']), ctrl.remove);

module.exports = router;


