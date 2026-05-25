const router = require('express').Router();
const ctrl = require('../controllers/reservationController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isOwner = require('../middleware/isOwner');

router.get('/', isAuthenticated, ctrl.list);

router.post('/', isAuthenticated, ctrl.create);

router.get('/:id', isAuthenticated, isOwner, ctrl.get);

router.put('/:id', isAuthenticated, isOwner, ctrl.update);

router.delete('/:id', isAuthenticated, isOwner, ctrl.remove);

module.exports = router;