const { Reservation } = require('../models');

async function isOwner(req, res, next) {
  const reservation = await Reservation.findByPk(req.params.id);

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva não encontrada' });
  }

  if (reservation.userId !== req.user.id) {
    return res.status(403).json({
      error: 'Acesso restrito ao dono do recurso',
    });
  }

  req.reservation = reservation;
  next();
}

module.exports = isOwner;
