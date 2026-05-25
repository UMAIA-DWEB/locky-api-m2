const router = require('express').Router();
const ctrl = require('../controllers/stationController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', isAuthenticated, ctrl.create);
router.put('/:id', isAuthenticated, ctrl.update);
router.delete('/:id', isAuthenticated, ctrl.remove);

module.exports = router;
