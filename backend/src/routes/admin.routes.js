const router = require('express').Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/admin.controller');

router.get('/analytics', auth(['admin']), ctrl.analytics);
router.get('/export', auth(['admin']), ctrl.exportCsv);

module.exports = router;


