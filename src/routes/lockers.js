const router = require('express').Router();
const ctrl = require('../controllers/lockerController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, ctrl.list);
router.get('/:id', isAuthenticated, ctrl.get);
router.post('/', isAuthenticated, ctrl.create);
router.put('/:id', isAuthenticated, ctrl.update);
router.delete('/:id', isAuthenticated, ctrl.remove);

module.exports = router;
